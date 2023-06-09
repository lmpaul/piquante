const fs = require('fs')
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
    const sauce = await Sauce.findOne({_id: req.params.id})
    if (sauce.userId !== req.auth.userId) {
      res.status(401).json({message: 'Non authorisé'})
    } else {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, async () => {
        try {
          await Sauce.deleteOne({_id: req.params.id})
          res.status(200).json({message: 'Objet supprimé'})
        } catch (error) {
          res.status(400).json({message: 'Erreur lors de la suppression'})
        }
      })

    }
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.modifySauce = async (req, res) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body}

  delete sauceObject.userId

  try {
    const sauce = await Sauce.findOne({_id: req.params.id})
    if (sauce.userId !== req.auth.userId) {
      res.status(401).json({message: 'Modification non autorisée.'})
    } else {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, async () => {
        try {
          await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
          res.status(200).json({message: 'Modification réussie.'})
        } catch (error) {
          res.status(400).json({message: 'Erreur lors de la modeification.'})
        }
      })
    }
  } catch (error) {
    res.status(400).json({ error })
  }


}

exports.likeSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({_id: req.params.id})
    const sauceObject = JSON.parse(JSON.stringify(sauce))

    let message
    if (req.body.like === 1 && !sauceObject.usersLiked.includes(req.body.userId)) {
      // like
      sauceObject.usersLiked.push(req.body.userId)
      sauceObject.likes += 1
      message = 'Like enregistré'
    } else if (req.body.like === -1 && !sauceObject.usersDisliked.includes(req.body.userId)) {
      // dislike
      sauceObject.usersDisliked.push(req.body.userId)
      sauceObject.dislikes += 1
      message = 'Dislike enregistré'
    } else if (req.body.like === 0 && sauceObject.usersLiked.includes(req.body.userId)) {
      // cancel like
      sauceObject.usersLiked = sauceObject.usersLiked.filter(id => id !== req.body.userId)
      sauceObject.likes -= 1
      message = 'Like annulé'
    } else if (req.body.like === 0 && sauceObject.usersDisliked.includes(req.body.userId)) {
      // cancel dislike
      sauceObject.usersDisliked = sauceObject.usersDisliked.filter(id => id !== req.body.userId)
      sauceObject.dislikes -= 1
      message = 'Like annulé'
    }
    await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    res.status(200).json({message: message})
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
}
