import * as cardDesignService from '../services/cardDesign.service.js';

export const getCardDesign = async (req, res) => {
  const design = await cardDesignService.getDesign(req.user.id, res.locals.params.id);
  res.json({ design });
};

export const saveCardDesign = async (req, res) => {
  const design = await cardDesignService.saveDesign(
    req.user.id,
    res.locals.params.id,
    req.body,
  );
  res.json({ design });
};
