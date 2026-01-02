// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_stale_maginty.sql';
import m0001 from './0001_shiny_silver_fox.sql';
import m0002 from './0002_noisy_king_bedlam.sql';
import m0003 from './0003_acoustic_meteorite.sql';
import m0004 from './0004_wet_hellion.sql';
import m0005 from './0005_sticky_longshot.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
