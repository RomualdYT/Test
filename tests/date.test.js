const assert = require('assert');

// Version robuste de parseFrDate
function parseFrDate(str) {
  if (typeof str !== 'string') return null;
  str = str.trim();

  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    const an = parseInt(m[1], 10), mois = parseInt(m[2], 10), j = parseInt(m[3], 10);
    const d = new Date(an, mois - 1, j);
    if (d.getFullYear() === an && d.getMonth() === mois - 1 && d.getDate() === j) return d;
  }

  const monthNames = {
    'janvier': 1, 'février': 2, 'fevrier': 2, 'mars': 3, 'avril': 4,
    'mai': 5, 'juin': 6, 'juillet': 7, 'août': 8, 'aout': 8,
    'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12, 'decembre': 12
  };

  m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let [ , j, mois, an ] = m.map(Number);
    if (an < 100) an += 2000;
    const d = new Date(an, mois - 1, j);
    if (d.getFullYear() === an && d.getMonth() === mois - 1 && d.getDate() === j) {
      return d;
    }
    return null;
  }

  m = str.match(/^(\d{1,2})\s+([\p{L}]+)/iu);
  if (m) {
    let j = parseInt(m[1], 10);
    let reste = str.slice(m[0].length).trim();
    const moisNom = m[2].toLowerCase();
    const mois = monthNames[moisNom];
    if (!mois) return null;
    m = reste.match(/^(\d{2,4})$/);
    if (!m) return null;
    let an = parseInt(m[1], 10);
    if (an < 100) an += 2000;
    const d = new Date(an, mois - 1, j);
    if (d.getFullYear() === an && d.getMonth() === mois - 1 && d.getDate() === j) {
      return d;
    }
  }

  return null;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

describe('parseFrDate', function() {
  it('parse format jj/mm/aaaa', function() {
    const d1 = parseFrDate('15/02/2024');
    assert.ok(isValidDate(d1));
    assert.strictEqual(d1.getFullYear(), 2024);
    assert.strictEqual(d1.getMonth(), 1);
    assert.strictEqual(d1.getDate(), 15);
  });

  it('parse format avec tirets', function() {
    const d2 = parseFrDate('15-02-2024');
    assert.ok(isValidDate(d2));
    assert.strictEqual(d2.getFullYear(), 2024);
    assert.strictEqual(d2.getMonth(), 1);
    assert.strictEqual(d2.getDate(), 15);
  });

  it('parse annee sur deux chiffres', function() {
    const d3 = parseFrDate('15/2/24');
    assert.ok(isValidDate(d3));
    assert.strictEqual(d3.getFullYear(), 2024);
    assert.strictEqual(d3.getMonth(), 1);
    assert.strictEqual(d3.getDate(), 15);
  });

  it('parse nom de mois', function() {
    const d4 = parseFrDate('15 février 2024');
    assert.ok(isValidDate(d4));
    assert.strictEqual(d4.getFullYear(), 2024);
    assert.strictEqual(d4.getMonth(), 1);
    assert.strictEqual(d4.getDate(), 15);
  });

  it('return null for invalid dates', function() {
    assert.strictEqual(parseFrDate('31/02/2024'), null);
    assert.strictEqual(parseFrDate('29/02/2023'), null);
  });

  it('parse leap day correctly', function() {
    const d5 = parseFrDate('29/02/2024');
    assert.ok(isValidDate(d5));
    assert.strictEqual(d5.getFullYear(), 2024);
    assert.strictEqual(d5.getMonth(), 1);
    assert.strictEqual(d5.getDate(), 29);
  });

  it('parse iso format', function(){
    const d6 = parseFrDate('2025-03-17T00:00:00Z');
    assert.ok(isValidDate(d6));
    assert.strictEqual(d6.getFullYear(), 2025);
    assert.strictEqual(d6.getMonth(), 2);
    assert.strictEqual(d6.getDate(), 17);
  });
});
