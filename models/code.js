const mongoose = require('mongoose')

const  codeSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  
 
 
})

module.exports = mongoose.model('code', codeSchema)