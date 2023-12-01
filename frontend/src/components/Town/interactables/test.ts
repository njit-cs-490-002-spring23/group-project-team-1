import react from 'react';

async function testDB() {
  await fetch('http://localhost:3001/leaderboard').then(async res => {
    const dict = await res.text();
    console.log('DICT', dict);
    return dict;
  });
}

const val = testDB();
console.log(val);
