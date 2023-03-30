const Sauce = require('../models/Sauce')


exports.getAllSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find()
    res.status(200).json(sauces)
  } catch (error) {
    res.status(400).json({message: 'La requête a échoué.', error: error})
  }
}

exports.getOneSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({_id: req.params.id})
    res.status(200).json(sauce)
  } catch (error) {
    res.status(400).json({message: 'La requête a échoué.', error: error})
  }
}

exports.createSauce = async (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  delete sauceObject.userId
  const sauce = new Sauce({...sauceObject,
                          userId: req.auth.userId,
                          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                          likes: 0,
                          dislikes: 0,
                          usersLiked: [],
                          usersDisliked: []
                        })

  try {
    await sauce.save()
    res.status(201).json({message: 'Sauce enregistrée'})
  } catch(error) {
    res.status(400).json({message: 'La création de la sauce a échouée.', error})
  }
}

exports.deleteSauce = async (req, res) => {
  try {
    await Sauce.deleteOne({_id: req.params.id})
    res.status(200).json({message: 'Article supprimé.'})
  } catch (error) {
    res.status(400).json({message: "La sauce n'a pas été supprimée.", error})
  }
}

exports.modifySauce = async (req, res) => {
  console.log(req.body)
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    iamgeUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body}

  delete sauceObject.userId
  try {
    const sauce = await Sauce.findOne({_id: req.params.id})
    if (sauce.userId !== req.auth.userId) {
      res.status(401).json({message: 'Modification non autorisée.'})
    } else {
      await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
      res.status(200)
    }
  } catch (error) {
    res.status(400).json({ error })
  }


}
