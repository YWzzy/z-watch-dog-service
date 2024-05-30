import { Context, Application } from 'egg';

export default (app: Application) => ({
  schedule: {
    cron: app.config.trafficStatsScheduleDay,
    type: 'all',
    disable: false,
    immediate: false,
  },
  async task(ctx: Context) {
    ctx.service.elasticsearch.trafficStats.getTrafficStatsDays();
  },
});

