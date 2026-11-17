// Chapter 3 island design. Building coordinates are in five-metre construction cells.
// Each landmark has its own footprint and mix of structures, not a single repeated house.
export const chapter3Sites = {
  mall: {}, ironworks: {}, observatory: {},
  sanctuary: { ground:'#d8c9a3', road:'#bfae85', wall:0xd5d0bd, roof:0x698b80, buildings:[['pagoda',-3,-3,4,4,2],['turret',4,-5,2,2,3],['turret',-7,3,2,2,3],['church',2,3,3,2,2]], feature:'sanctuary' },
  joneses: { ground:'#75975b', road:'#ab9166', wall:0xb7a37b, roof:0x68533b, buildings:[['treehouse',-6,-4,3,2,1],['aFrame',2,-6,3,2,1],['barn',2,2,3,2,1]], feature:'camp' },
  sleepy: { ground:'#c7bda9', road:'#76818a', wall:0xd0e5e0, roof:0x536e80, buildings:[['lighthouse',-7,-5,2,2,5],['house',-2,-5,3,2,2],['house',3,2,3,2,1],['greenhouse',-5,3,3,2,1]], feature:'harbor' },
  coney: { ground:'#c4bda9', road:'#69747a', wall:0xe9d5b6, roof:0xb47562, buildings:[['house',-6,-5,3,2,2],['house',2,-5,3,2,2],['pagoda',-2,2,3,2,2],['greenhouse',4,3,2,2,1]], feature:'crossroads' },
  reels: { ground:'#e2bb81', road:'#bd8d55', wall:0xd5ad7b, roof:0x835748, buildings:[['barn',-4,-6,4,2,1],['house',4,-2,2,2,1],['turret',-6,4,2,2,2]], feature:'drivein' },
  greasy: { ground:'#aab590', road:'#7b7c73', wall:0xe2b966, roof:0xd4513f, buildings:[['barn',-4,-4,4,2,1],['house',3,-5,3,2,2],['house',-6,2,3,2,2],['greenhouse',3,3,2,2,1]], feature:'restaurant' },
  canyon: { ground:'#d5a478', road:'#c39267', wall:0xe5c19f, roof:0xa35f4b, buildings:[['house',-6,-5,3,3,3],['house',2,-5,3,3,2],['pagoda',-2,3,3,2,2],['turret',5,3,2,2,3]], feature:'resort' },
  cuddle: { ground:'#9baea0', road:'#a99a7b', wall:0xbb8c78, roof:0x865364, buildings:[['aFrame',-6,-4,3,2,1],['treehouse',2,-5,3,2,1],['aFrame',-3,3,3,2,1]], feature:'camp' },
  tilted: { ground:'#a7adb0', road:'#656a72', wall:0xc3b1a3, roof:0x63727e, buildings:[['house',-7,-6,3,3,4],['house',2,-6,3,3,3],['house',-7,2,3,3,3],['turret',2,2,2,2,5]], feature:'city' },
  logjam: { ground:'#c1d1cc', road:'#a79578', wall:0xa6794c, roof:0x596c71, buildings:[['barn',-6,-5,4,3,1],['barn',2,-5,3,2,1],['aFrame',-3,3,3,2,1]], feature:'lumber' },
  shifty: { ground:'#bac7c5', road:'#918979', wall:0x967452, roof:0x4d5255, buildings:[['barn',-5,-4,3,2,1],['aFrame',2,-4,3,2,1],['turret',-2,3,2,2,3]], feature:'mine' },
  bugle: { ground:'#a49f92', road:'#77716d', wall:0xbdadb0, roof:0x734c4b, buildings:[['house',-3,-4,4,3,5],['house',3,3,2,2,2],['turret',-7,2,2,2,3]], feature:'news' },
  covert: { ground:'#d4e0dc', road:'#8d9693', wall:0x899b99, roof:0x415d62, buildings:[['bunker',-4,-3,4,3,2],['turret',4,-3,2,2,3],['house',-5,3,2,2,2]], feature:'covert' },
  butter: { ground:'#d5ac71', road:'#b48755', wall:0xb97543, roof:0x663d35, buildings:[['barn',-4,-4,4,3,1],['house',3,-4,2,2,1],['barn',-3,3,3,2,1]], feature:'ranch' },
  speedway: { ground:'#d8ac77', road:'#bd8752', wall:0xccb7a0, roof:0xb83b32, buildings:[['barn',-6,-4,3,2,1],['house',3,-5,3,2,2],['turret',-1,3,2,2,2]], feature:'race' },
  seaside: { ground:'#e0d3ac', road:'#c5b898', wall:0xe1ddd0, roof:0x48899a, buildings:[['lighthouse',-6,-5,2,2,5],['house',1,-5,3,2,2],['pagoda',-3,3,3,2,2]], feature:'beach' },
  crystallake: { ground:'#a7c6a6', road:'#b5a58b', wall:0xc6ad89, roof:0x506f62, buildings:[['aFrame',-7,2,3,2,1],['treehouse',4,-4,2,2,1],['greenhouse',-3,5,2,2,1]], feature:'lake' },
  seven: { ground:'#a6b8ac', road:'#7d938c', wall:0x819ba1, roof:0x3a7770, buildings:[['turret',-5,-4,2,2,4],['house',0,-5,3,2,2],['turret',3,2,2,2,3],['greenhouse',-5,3,2,2,1]], feature:'outpost' }
};
