const Sauce = require('../models/Sauce')


exports.getAllSauces = async (req, res) => {
  try {
    const sauce = Sauce.find()
    res.status(200).json(sauces)
  } catch (error) {
    res.status(400).json({message: 'La requête a échoué.', error})
  }
}

exports.createSauce = async (req, res) => {
  delete(req.body._id)
  const sauce = new Sauce({...req.body})
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
