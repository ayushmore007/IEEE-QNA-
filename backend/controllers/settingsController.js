const Setting = require('../models/Setting');

const MAX_QUESTIONS_PER_DEVICE = parseInt(process.env.MAX_QUESTIONS_PER_DEVICE) || 5;

const isSubmissionsOpen = async () => {
  const s = await Setting.findOne({ key: 'submissionsOpen' });
  return s ? s.value !== false : true;
};

const getStatus = async (req, res) => {
  res.json({ success: true, open: await isSubmissionsOpen(), max: MAX_QUESTIONS_PER_DEVICE });
};

const setStatus = async (req, res) => {
  const open = req.body.open !== false;
  await Setting.findOneAndUpdate({ key: 'submissionsOpen' }, { value: open }, { upsert: true });
  res.json({ success: true, open });
};

module.exports = { getStatus, setStatus, isSubmissionsOpen, MAX_QUESTIONS_PER_DEVICE };
