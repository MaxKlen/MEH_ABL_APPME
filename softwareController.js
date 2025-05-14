const inAppList = [
  'AssetVoice™',
  'Effio™',
  'ePAV™'
];
const digitalList = [
  'AssetVoice™',
  'Effio™',
  'ePAV™',
  'emiTr™',
  'iQx™',
  'hiQbe™',
  'AquaSafe™'
];
const softwareList = Array.from(new Set([...inAppList, ...digitalList])).sort();

module.exports = {
  getAll: (req, res) => {
    res.render('software', { softwareList });
  }
};
