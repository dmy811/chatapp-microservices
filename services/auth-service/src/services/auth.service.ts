// import { Op } from 'sequelize'
// import { UserCredentials } from '@/models'
// import { AuthResponse, RegisterInput } from '@/types/auth'
// import { HttpError } from '@chatapp/common'
// import { sequelize } from '@/db/sequelize'

// export const register = async (input: RegisterInput): Promise<AuthResponse> => {
//   const existingUser = await UserCredentials.findOne({
//     where: { email: { [Op.eq]: input.email } }
//   })
//   if (existingUser) {
//     throw new HttpError(409, 'user with this email already exists')
//   }

//   const transaction = await sequelize.transaction()
//   try {
//     const passwordHash = await
//   } catch (error) {

//   }
// }
