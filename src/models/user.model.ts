import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

// Define the CartProduct interface
interface CartProduct {
  productId: string;
  quantity: number;
}

// Define the User interface extending Mongoose's Document
interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  address: string;
  password: string;
  currentCart: Types.Array<CartProduct>;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User Schema
const userSchema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentCart: [
    {
      productId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

// Pre-save middleware to hash the password before saving it
userSchema.pre("save", async function (next) {
  const user = this as User;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare the password during login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const UserModel = model<User>("User", userSchema);
export default UserModel;
