import "./Sofas.css";
import { Footer } from "../Footer/footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navbar } from "../Header/NavBar";

export function SofaPage() {
  const [data, setData] = useState([])
  const [formattedData, setFormattedData] = useState([]);
  const [value, setValue] = useState("")
  const [sortData, setSortData] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadSofasData(page)
  }, [page])


  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios
      .get(`http://localhost:3333/Sofas?q=${value}`)
      .then((res) => {
        setData(res.data)
        setValue("")
      })
      .catch((err) => console.log(err))
  }
  const handleSort = async (e) => {
    let value = e.target.value;
    setSortData(value);
    try {
      const response = await axios.get(
        `http://localhost:3333/Sofas?_sort=${value}&_order=asc`
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (val) =>{
    const updatePage = page + val;
    setPage(updatePage)
  }

  const loadSofasData = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:3333/Sofas?_limit=9&_page=${page}`
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    console.log("data", data);
    const formattedData = data.map((element) => {
      const formattedPrice = Number(element.totalPrice.replace(/,/g, ""));
      const discountPrice =
        formattedPrice - (formattedPrice * element.discount) / 100;
      return {
        id: element.id,
        name: element.name,
        brandName: element.brandName,
        image: element.image,
        totalPrice: formattedPrice,
        discount: element.discount,
        shippingDay: element.shippingDay,
        discountPrice: discountPrice,
      };
    });
    setFormattedData(formattedData);
  }, [data]);

  const sortOptions = ["name", "brandName", 'totalPrice', "shippingDay", "discount"]

  return (
    <>
      <Navbar doIt={handleSearch} />
      <div className="FirstDiv">
        <h2>All Sofas</h2>
        <p>Perfect for the whole family to pile onto for game nights or for you to lounge on while binging your favorite TV shows, the sofa is that cozy piece of furniture that can truly bring any room to life. Available in so many exciting designs, shapes, and seating arrangements, the sofa design can be easily ... More</p>
      </div>
      <div className="filterdiv">
        <div>
        </div>
        <div>
          <select className="sortbtn" onChange={handleSort} value={sortData}>
            <option value="">Recommended</option>
            {sortOptions.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}

          </select>
        </div>
      </div>

      <div className="sofadiv">
        {formattedData.map((item) => (
          <div key={item.id} className="item">
            <img className="image" src={item.image} alt={item.name} />
            <p className="name">{item.name}</p>
            <p className="brandName">{item.brandName}</p>
            <p className="totalPrice">Total Price: ₹{item.totalPrice.toFixed(2)}</p>
            <p className="discount">Discount: {item.discount}%</p>
            <p className="discountPrice">Discount Price: ₹{item.discountPrice.toFixed(2)}</p>
            <p className="shippingDay">Seating Capacity: {item.shippingDay}</p>
            <button className="add-to-cart-button">Add to Wishlist</button>
            <div className="bore">
              <button className="add-to-compare-button">Add to Compare</button>
              <button className="view-options-button">View 2 Options</button>
            </div>

          </div>
        ))}
      </div>

      <div className="pagination-div">
        <button disabled={page===1} onClick={()=>handlePageChange(-1)}>PREV</button>
         <h1> {page}</h1>
        <button onClick={()=>handlePageChange(1)}>NEXT</button>
      </div>
      <Footer />
    </>
  )
}
