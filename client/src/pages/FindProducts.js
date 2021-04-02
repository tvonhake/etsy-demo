import React, {useState, useEffect} from 'react'
import { Card, Dropdown } from 'semantic-ui-react'
import axios from 'axios'

const FindProducts = () => {
  //set chosen category so we only have to make 1 axios call, in onSellerChange fn.
  const [chosenCategory, setChosenCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [sellers, setSellers] = useState([])
  const [chosenSeller, setChosenSeller] = useState(false)

  const [categories, setCategories] = useState([
    // {key: 'All', text: 'All Products', value: 'All'},
    {key: 'Accessories', text: 'Accessories', value: 'Accessories'},
    {key:'Apparel', text: 'Apparel', value: 'Apparel'},
    {key: 'Home', text: 'Home', value: 'Home'},
    {key:'Living', text: 'Living', value: 'Living'},
    {key:'Wedding', text: 'Wedding', value: 'Wedding'},
    {key:'Entertainment', text: 'Entertainment', value: 'Entertainment'},
    {key:'Collectibles', text: 'Collectibles', value: 'Collectibles'},
    {key: 'Crafts', text: 'Crafts', value: 'Crafts'},
    {key:'Toys', text: 'Toys', value: 'Toys'}
  ])

  //axios call on mount
  useEffect (() => {
    getSellerId()
  }, [])

  //set chosenCategory for axios call in onSellerChange
  const onCategoryChange = (e, {value}) => {
    setChosenCategory(value)
  }

  //get products based on Category and Seller
  const onSellerChange = async (e, {value}) => {
  try{
    let res = await axios.get(`/api/products/${chosenCategory}/${value}`)
    setProducts(res.data)
    setChosenSeller(true)
  }catch(err){
    alert(err)
  }
  }

  //get list of sellers for dropdown menu in page
  const getSellerId =  async () => {
    let res = await axios.get(`/api/sellers`)
    let normalizedSellerData = normalizeSellerData(res.data)
    setSellers(normalizedSellerData)
  }

  //normalize data into objects to feed into <Select> element
  const normalizeSellerData = (sellerArr) => {
    return sellerArr.map(seller => { 
      return {key: seller.id , text: seller.name , value: seller.id}
    })
    }

  //render card for each product from onSellerChange axios call
  const renderProducts = () => {
    return(
      <Card.Group style={{marginTop: '20px'}}>
        {products.map( p => (
          <>
          <Card style={{padding: '10px'}}>
            <Card.Header>
              <h3>{p.description}</h3>
            </Card.Header>
            <Card.Meta>
              <p>{`Price: $${p.price}`}</p>
            </Card.Meta>
          </Card>
          </>
        ))}
      </Card.Group>
    )
  }

  const choiceWarning = () => {
    if(chosenCategory !== null){
      if(chosenSeller == false){
      return (
        <p>Select a Seller</p>
      )
      }else{
        return(
          <p>No products match chosen Category and Seller.</p>
        )
      }
    }else{
      return(
        <p>Choose a Category</p>
      )
    }
      
  }

return (
  
  <>  
    {/* check to see if sellers is populated before rendering */}
    {sellers.length !== 0 ? (
      <>
      <div>
        <h1>Find Products</h1>
      </div>
      <div>
        <Dropdown
          onChange={onCategoryChange}
          placeholder='Select a Category'
          fluid
          selection
          options={categories}
        />
      </div>
      <div>
        {chosenCategory ? 
        <Dropdown
          onChange={onSellerChange}
          placeholder='Select a Seller'
          fluid
          selection
          options={sellers}
        /> : <h4></h4> }
      </div>
      </>
    ) : (<h1>"loading"</h1>)}
    {((products.length >= 1)) ? renderProducts() : choiceWarning()}
  </>
)
}

export default FindProducts
