import { User } from "../models/user.model.js";

export class userRepository{
    
    async createUser(data){
        return await User.create(data)
    } 
    async getUser(email){
        return await User.findOne({email})
    } 
    async getallUsers(){
        return await User.find()
    }   
    async deleteUser(id){
        return await User.findByIdAndDelete(id)
    }
    async getUserById(id){
        return await User.findById(id)
    }
    async updateUser(id, updateData){
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
}
