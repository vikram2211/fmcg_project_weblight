const productModel = require('../Models/productModel');
const validator = require('../Validator/validator');


const createProduct = async function (req, res) {
    try {
        const productData = req.body;


        if (Object.keys(productData) == 0) {
            return res.status(400).send({ status: false, message: "Please fill all the field." })
        }

        if (!productData.name) {
            return res.status(400).send({ status: false, message: "Please give name." })
        }
        if (!productData.description) {
            return res.status(400).send({ status: false, message: "Please give description." })
        }
        if (!productData.category) {
            return res.status(400).send({ status: false, message: "Please give category." })
        }
        if (!productData.price) {
            return res.status(400).send({ status: false, message: "Please give price." })
        }

        let product = await productModel.create(productData);

        return res.status(200).send({ status: true, message: "Product created sucessfully", data: product });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getProducts = async function (req, res) {
    try {

        const { name, category, price, page, limit } = req.query;
        let skip = (page - 1) * limit;

        if (page && limit) {

            const allProducts = await productModel.find().select({ name: 1, category: 1, price: 1, _id: 0 }).limit(limit).skip(skip);
            return res.status(200).send({ status: true, message: "All products....keep shopping!", data: allProducts });

        } else {


            let filter = {};

            if (name && category && price) {
                filter = { name, category, price };
            } else if (name || category || price) {
                if (name) filter = { name };
                else if (category) filter = { category };
                else if (price) filter = { price };
            } else if (name && category) {
                filter = { name, category };
            } else if (name && price) {
                filter = { name, price };
            } else if (category && price) {
                filter = (category, price)
            }


            const fliteredProduct = await productModel.find(filter).select({ name: 1, price: 1, category: 1, _id: 0 }).sort({ name: 1 });
            if (fliteredProduct.length === 0) {
                return res.status(400).send({ status: true, message: "No data found." });
            }
            return res.status(200).send({ status: true, message: "Here are your products", data: fliteredProduct })


        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}


const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId;

        let validId = validator.isValidObjectId(productId);
        if (!validId) {
            return res.status(400).send({ status: false, message: "Please give valid productId" })
        }

        const data = req.body;
        const { name, description, category, price } = data;

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please give data to update" })
        };
        const checkProduct = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!checkProduct) {
            return res.status(400).send({ status: false, message: "Can't updated product that does not exist." })
        }

        const updatedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, data, { new: true });
        //console.log(updatedProduct);

        return res.status(200).send({ status: true, message: "Product updated", data: updatedProduct });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}


const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId;
        let validId = validator.isValidObjectId(productId);
        if (!validId) {
            return res.status(400).send({ status: false, message: "Please give valid productId" })

        }
        let deletedProduct = await productModel.findOne({ _id: productId, isDeleted: true });
        if (deletedProduct) {
            return res.status(400).send({ status: false, message: "Product already deleted" });
        }
        let productToBeDeleted = await productModel.findById(productId)
        if (!productToBeDeleted) return res.status(404).send({ status: false, msg: "Data not found" });
        if (productToBeDeleted.isDeleted === false) {
            const deletedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true }, { new: true });
            return res.status(200).send({ status: true, message: "Product deleted." })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports.createProduct = createProduct;
module.exports.getProducts = getProducts;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;