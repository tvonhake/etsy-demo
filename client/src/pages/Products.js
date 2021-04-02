import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {List, Table} from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroller';

const Products = () => {

  // const [products, setProducts] = useState([]) //not used, replaced w/ sellers array for data restructure
  
  const [sellers, setSellers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)
  
  //get seller/product data via api
  const getProducts = async (page = 1) => {
    let res = await axios.get(`/api/products?page=${page}`)
    setCurrentPage(page)
    // console.log('getProducts res: ', res)
    setTotalPages(res.data.total_pages)
    setSellers(createSellerArray(res.data.products))
  }

  //restructure data from axios for seller product tables in page
  const createSellerArray = (data) =>{
    let ids = [...new Set(data.map( d => d.seller_id ))];
    //set temp seller array to push to, then set non-temp seller array to match
    let sellerArray = []
    ids.map( id => {
      let products = data.filter( d => d.seller_id === id );
      let { seller_id, name, email } = products[0];

      let sellerProducts = products.map( p => { 
        let { description, price, category, product_id } = p;
        return { description, price, category, product_id };
      });

      let detail = { seller_id, name, email, products: sellerProducts };

      sellerArray.push(detail);
    });
    
    return(
      sellerArray
    )
  }

  useEffect(()=>{
    getProducts()
  },[])

  // const loadMore = async () => {
  //   const page = currentPage + 1;
  //   if(sellers.length > 0){
  //   let res = await axios.get(`/api/products?page=${page}`)
  //   // console.log('loadMore res: ', res.data)
  //   // sellers.push(createSellerArray(res.data.products))
  //   }
    
  // }

  //Called in renderSellers to insert each product row
  const renderProducts = (products) => {
    // console.log(products)
    return products.map( p => 
      <>
        <Table.Row key= {p.product_id} >
          <Table.Cell>{p.description}</Table.Cell>
          <Table.Cell>{p.category}</Table.Cell>
          <Table.Cell>${p.price}</Table.Cell>
        </Table.Row>
      </>
    )
  }

  const styles = {
    scroller: { 
      height: '80vh', 
      overflow: 'auto', 
    },
  }

  //map through sellers array, create table for each seller
  const renderSellers = () =>{
    // console.log('renderSellers called')
    // console.log(sellers)
      return (
        <List style={styles.scroller}>
          <InfiniteScroll
          pageStart={currentPage}
          // loadMore={loadMore()}
          hasMore={currentPage < totalPages}
          useWindow={false}
          >
            { sellers.map( seller => {
                let { seller_id, name, email, products } = seller;
                return (
                  <List.Item key={seller_id}>
                    <List.Header><h2>{name} - {email}</h2></List.Header>
                    <List.Item>
                      <Table celled>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Category</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {renderProducts(products)}
                        </Table.Body>
                      </Table>
                    </List.Item>
                  </List.Item>
                )
              })
            }
          </InfiniteScroll>
        </List>
      )
    }
  
  const renderPageNav = () => {
    
    let numsJSX =[]
    for(let i = 1; i <= totalPages; i++){
      numsJSX.push(<span
        onClick={()=>getProducts(i)}
        style={
          {cursor:'pointer', marginRight: '3px', color: currentPage == i ? 'red':'black'}
        }>{i}</span>)
    }
    return numsJSX
    
  }

  
  
  return (
    <>
    <div>
      <h2>All Products by Seller</h2>
      <p>Pages: {renderPageNav()}</p>
      {renderSellers()}
    </div>
    </>
  )
}

export default Products
