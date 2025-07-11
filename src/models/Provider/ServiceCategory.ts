import  { Document, Schema, model, models } from 'mongoose';

interface ISubCategory {
  id: string;
  name: string;
}

export interface ICategory extends Document {
  id: string;
  name: string;
  subcategory: ISubCategory[];
}

const SubCategorySchema = new Schema<ISubCategory>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false } // Do not auto-generate _id for subcategory items
);

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  subcategory: [SubCategorySchema],
});

const ServiceCategory =
  models.ServiceCategory || model<ICategory>('ServiceCategory', CategorySchema);

export default ServiceCategory;
