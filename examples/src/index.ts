import { TorboxApi } from 'torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const { data } = await torboxApi.general.getUpStatus();

  console.log(data);
})();
