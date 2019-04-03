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
    products: async (_, args) => {
      const prods = await Product.find()
      return prods
    },
    product: async (_, args) => {
      const prod = await Product.findById(args.id).then(data => data)
      return prod
    }
  },
  Mutation: {
    newProduct(_, args, ctx) {
      let prod = new Product({
        name: args.input.name,
        price: args.input.price,
        image: args.input.image,
        type: args.input.type,
        createdBy: ctx.user,
        description: args.input.description,
        bikeType: args.input.bikeType,
        range: args.input.range
      })

      const newProd = prod.save()

      return newProd
    },

    updateProduct: async (_, args) => {
      let prod = {
        name: args.input.name,
        price: args.input.price,
        image: args.input.image,
        type: args.input.type,
        description: args.input.description,
        bikeType: args.input.bikeType,
        range: args.input.range
      }

      const result = await Product.findByIdAndUpdate(args.id, prod, { new: true }).then(data => data)

      return result
    },

    removeProduct: async (_, args) => {
      const removedProd = await Product.findByIdAndRemove(args.id).then(data => data)
      return removedProd
    }
  },
  Product: {
    __resolveType(product) {},
    createdBy: async _user => {
      const user = await User.findOne({ _id: _user.createdBy })
      return user
    }
  }
}
