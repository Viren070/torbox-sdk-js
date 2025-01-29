# CreateTorrentRequest

**Properties**

| Name     | Type        | Required | Description                                                                                                                                                                                      |
| :------- | :---------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowZip | string      | ❌       | Tells TorBox if you want to allow this torrent to be zipped or not. TorBox only zips if the torrent is 100 files or larger.                                                                      |
| asQueued | string      | ❌       | Tells TorBox you want this torrent instantly queued. This is bypassed if user is on free plan, and will process the request as normal in this case. Optional.                                    |
| file     | ArrayBuffer | ❌       | The torrent's torrent file. Optional.                                                                                                                                                            |
| magnet   | string      | ❌       | The torrent's magnet link. Optional.                                                                                                                                                             |
| name     | string      | ❌       | The name you want the torrent to be. Optional.                                                                                                                                                   |
| seed     | string      | ❌       | Tells TorBox your preference for seeding this torrent. 1 is auto. 2 is seed. 3 is don't seed. Optional. Default is 1, or whatever the user has in their settings. Overwrites option in settings. |
