import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

export default {
  Query: {
    products(_, args) {
      const prods = Product.find()
      return { products: prods }
    },
    product: async (_, args) => {
      const prod = await Product.findOne({ _id: args.id }).then(data => data)

      return {
        name: prod.name,
        price: prod.price,
        image: prod.image,
        type: productsTypeMatcher[prod.type],
        createdBy: prod.createdBy,
        description: prod.description,
        liquidCooled: prod.liquidCooled,
        range: prod.range,
        bikeType: {}
      }
    }
  },
  Mutation: {
    newProduct(_, args) {
      let prod = new Product({
        name: args.input.name,
        price: args.input.price,
        image: args.input.image,
        type: args.input.type,
        description: args.input.description,
        bikeType: args.input.bikeType,
        range: args.input.range
      })

      const newProd = prod.save()

      return { product: newProd }
    },

    updateProduct(_, args) {
      const prod = Product.findById(args.id)

      prod.name = args.input.name !== null ? args.input.name : prod.name
      prod.price = args.input.price !== null ? args.input.price : prod.price
      prod.image = args.input.image !== null ? args.input.image : prod.image
      prod.type = args.input.type !== null ? args.input.type : prod.type
      prod.description = args.input.description !== null ? args.input.description : prod.description
      prod.bikeType = args.input.bikeType !== null ? args.input.bikeType : prod.bikeType
      prod.range = args.input.range !== null ? args.input.range : prod.range

      prod.save()

      return { product: prod }

      // https://vegibit.com/mongoose-crud-tutorial/
    },

    removeProduct(_, args) {
      const removedProd = Product.deleteOne({ _id: args.id })
      return { product: removedProd }
    }
  },
  Product: {
    __resolveType(product) {}
  }
}
