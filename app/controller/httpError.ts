import dayjs from 'dayjs';
import { Controller } from 'egg';

export default class HttpErrorController extends Controller {
  public async getHttpErrorRank() {
    const { ctx, service } = this;
    const { appId, beginTime, endTime } = ctx.query;
    const data = await service.elasticsearch.report.httpError.getHttpErrorRank(appId, beginTime, endTime);
    ctx.success(data);
  }
  public async getHttpDoneRank() {
    const { ctx, service } = this;
    const { appId, beginTime, endTime } = ctx.query;
    const data = await service.elasticsearch.report.httpError.getHttpDoneRank(appId, beginTime, endTime);
    ctx.success(data);
  }
  public async getHttpErrorRang(){
    const { ctx, service } = this;
    const { appId, beginTime, endTime } = ctx.query;
    const today = dayjs().format('YYYY-MM-DD');
    const getDataFromCache = async(appId: string, date: string): Promise<number> => {
      const cacheKey = dayjs(date).format('YYYY-MM-DD');
      if(dayjs(cacheKey).diff(today) > 0){
        return 0;
      }
      if(cacheKey === today){
        return await service.elasticsearch.report.httpError.getOneDayHttpErrorCount(appId, cacheKey);
      }else{
        const cacheData = await this.service.redis.everyDayHttpError.getHttpError(appId, cacheKey);
        if(cacheData)return cacheData;
        const esData = await service.elasticsearch.report.httpError.getOneDayHttpErrorCount(appId, cacheKey);
        await this.service.redis.everyDayHttpError.saveHttpError(appId, cacheKey, esData);
        return esData;
      }
    };
    let index = dayjs(beginTime);
    const task: any[] = [];
    const label: string[] = [];
    while (index.diff(dayjs(endTime)) <= 0) {
      label.push(index.format('MM-DD'));
      task.push(getDataFromCache(appId, index.format('YYYY-MM-DD')));
      index = index.add(1, 'day');
    }
    const data = await Promise.all(task);
    const result = data.map((item, index) => ({
      value: Number(item || 0),
      label: label[index],
    }));
    this.ctx.success(result);
  }

  public async getHttpList() {
    const { url, beginTime, endTime, from, size, appId, sorterName, sorterKey, requestType, link } = this.ctx.query;
    const data = await this.service.elasticsearch.report.httpError.getHttpList(appId, {
      url,
      link,
      beginTime: beginTime ? new Date(beginTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      from: from ? Number(from) - 1 : 1,
      size: size ? Number(size) : 10,
      sorterName,
      sorterKey,
      requestType,
    });
    this.ctx.success(data);
  }
}
