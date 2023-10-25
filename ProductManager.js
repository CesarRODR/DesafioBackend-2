const {promises: fs} = require('fs')

class Product {
    
    constructor({id, category, title, thumbnail,stock, price}){
        this.id = id
        this.category = category
        this.title = title
        this.thumbnail = thumbnail  
        this.stock = stock 
        this.price = price
    }
}

class ProductManager {
    static #lastId = 0
    #products
   
    constructor({ruta}){
        this.ruta = ruta
        this.#products =[]
    }
  
    async init() {
        try{
            await this.#readProducts()
        }catch (error){
            await this.#writeProducts()
        }
        if (this.#products.length === 0){
            ProductManager.#lastId = 0
        }else{
            ProductManager.#lastId = this.#products.at(-1).id
        }
    }


    static #generarNewId() {
        return ++ProductManager.#lastId
    }

    async #readProducts(){
        const leidoEnJson = await fs.readFile(this.ruta, 'utf-8')
        this.#products = JSON.parse(leidoEnJson) 
    }
    
    async #writeProducts(){
        await fs.writeFile(this.ruta, JSON.stringify(this.#products))
    }

    
    async addProduct({category, title, description, thumbnail, stock, price}) {
        if (!category || !title || !description || !stock || !price) {
            throw new Error('Todos los campos son obligatorios');
        }
        
        const id = ProductManager.#generarNewId()
        const product = new Product({id, category, title, description, thumbnail, stock, price})
        await this.#readProducts()
        this.#products.push(product)
        await this.#writeProducts()
        return product
    }

    async getProducts() {
        await this.#readProducts()
        return this.#products
       
    }

    getProductById(id) {
        try{
            const buscada = this.#products.find((product) => product.id === id)
            if (!buscada) throw new Error (`Not Found`);
            return buscada;
        }catch (error){
            console.log(error.message);
        }
    }
     
    async updateProduct(id,{category, object, title, description, thumbnail, code, stock, price}){
        const index = this.#products.findIndex((product) => product.id === id)
        if (index != -1){
            await this.#readProducts()
            this.#products[index] = {id, category, object, title, description, thumbnail, code, stock, price};
            await this.#writeProducts()
            return this.#products
        }
    }

    async deleteProduct(id){
        const index = this.#products.findIndex((product) => product.id === id)
        if (index != -1){
            await this.#readProducts()
            this.#products.splice(index,1)
            await this.#writeProducts()
            return this.#products
        }
    }
}

async function main () {

const ProdMan = new ProductManager({ ruta: 'products.json' })
//await ProdMan.init()
const prod1 = await ProdMan.addProduct({
    category:"DVR",
    title: "Dvr 16ch",
    description: "Dvr 16 canales tecnologia 1080 lite",
    price: 85.00,
    thumbnail: "imagen1.jpg",
    code: "dvr123",
    stock: 10,
})

const prod2 = await ProdMan.addProduct({
    category:"CAMARA",
    title: "Camara domo",
    description: "Camara domo exterior 3.6mm ip67",
    price: 15.00,
    thumbnail: "imagen2.jpg",
    code: "domo123",
    stock: 15,
})

const prod3 = await ProdMan.addProduct({
    category:"DVR",
    title: "Dvr 8ch",
    description: "Dvr 8 canales tecnologia 1080 lite",
    price: 75.00,
    thumbnail: "imagen3.jpg",
    code: "dvr123",
    stock: 10,
})

const prod4 = await ProdMan.addProduct({
    category:"CAMARA",
    title: "Camara bullet",
    description: "Camara bullet exterior 3.6mm ip67",
    price: 19.00,
    thumbnail: "imagen4.jpg",
    code: "bullet123",
    stock: 15,
})

const prod15 = await ProdMan.addProduct({
    category:"CAMARA",
    title: "Camara domo ptz",
    description: "Camara domo ptz lente 12.mm a 2,8.mm",
    price: 190.00,
    thumbnail: "imagen5.jpg",
    code: "domo123",
    stock: 10,
})
console.log(await ProdMan.getProducts())

}

main()
