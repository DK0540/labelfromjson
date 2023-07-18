import React, { useState, useEffect } from "react";
import Barcode from "jsbarcode";
import { saveAs } from "file-saver";
import axios from "axios";
import "./styles.css";

const BarcodeLabelApp = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      setProducts(json);
    };

    reader.readAsText(file);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/products");
      const data = response.data; // No need to parse the response data
      setProducts(data.products);
      console.log(data.products);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    generateBarcodeLabels();
  }, [products]);

  const generateBarcodeLabels = () => {
    const updatedProducts = products.map((product) => {
      const barcodeOptions = {
        format: "CODE128",
        displayValue: false, // Set displayValue to false to hide the associated data
        margin: 10,
      };

      const barcodeInput = `${product.trackingId}-${product.id}-${product.title}-${product.brand}-${product.price}`;

      const canvas = document.createElement("canvas");
      Barcode(canvas, barcodeInput, barcodeOptions);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        product.barcodeImage = url;
        setProducts([...updatedProducts]);
      });

      return product;
    });
  };

  //search function
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const results = products.filter((product) =>
      product.trackingId.includes(searchTerm)
    );
    setSearchResults(results);
  };

  return (
    <div className="main">
      <h1 className="heading">Product Barcode Label Printing App</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <input
        type="text"
        placeholder="Search by Tracking ID"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="container">
        {(searchResults.length > 0 ? searchResults : products).map(
          (product) => (
            <div key={product.id} className="card" id={`card-${product.id}`}>
              <div className="cname">NameOC</div>
              <div key={product.id}>
                <div className="contenttext">
                  <h1 className="htitle">Title:</h1>
                  <h1 className="h1title">{product.title}</h1>
                </div>
                <div className="contenttext1">
                  <h1 className="htitle">Price:</h1>{" "}
                  <h1 className="h1title1">{product.price}</h1>
                </div>
                <div className="contenttext2">
                  <h1 className="htitle">Rating:</h1>
                  <h1 className="h1title2"> {product.rating}</h1>
                </div>
                <div className="contenttext3">
                  <h1 className="htitle">Brand:</h1>{" "}
                  <h1 className="h1title3">{product.brand}</h1>
                </div>
                <div className="contenttext4">
                  <h1 className="htitle">Category:</h1>{" "}
                  <h1 className="h1title4">{product.category}</h1>
                </div>
                {product.barcodeImage && (
                  <div>
                    <img
                      src={product.barcodeImage}
                      alt="Barcode"
                      className="barcode"
                    />
                    <div className="trackno">{product.trackingId}</div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BarcodeLabelApp;
//-------------------------------------------------------------------------->>>>Fetc data from api

//-------------------------------------------------------------------------->>>upload from local
// import React, { useState, useEffect } from "react";
// import Barcode from "jsbarcode";
// import { saveAs } from "file-saver";
// import "./styles.css";

// const BarcodeLabelApp = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const json = JSON.parse(e.target.result);
//       setProducts(json);
//     };

//     reader.readAsText(file);
//   };

//   useEffect(() => {
//     generateBarcodeLabels();
//   }, [products]);

//   const generateBarcodeLabels = () => {
//     const updatedProducts = products.map((product) => {
//       const barcodeOptions = {
//         format: "CODE128",
//         displayValue: false, // Set displayValue to false to hide the associated data
//         margin: 10,
//       };

//       const barcodeInput = `${product.trackingId}-${product.id}-${product.title}-${product.brand}-${product.price}`;

//       const canvas = document.createElement("canvas");
//       Barcode(canvas, barcodeInput, barcodeOptions);
//       canvas.toBlob((blob) => {
//         const url = URL.createObjectURL(blob);
//         product.barcodeImage = url;
//         setProducts([...updatedProducts]);
//       });

//       return product;
//     });
//   };

//   //search function
//   const handleSearch = (event) => {
//     const searchTerm = event.target.value;
//     setSearchTerm(searchTerm);

//     const results = products.filter((product) =>
//       product.trackingId.includes(searchTerm)
//     );
//     setSearchResults(results);
//   };

//   return (
//     <div className="main">
//       <h1 className="heading">Product Barcode Label Printing App</h1>
//       <input type="file" accept=".json" onChange={handleFileUpload} />
//       <input
//         type="text"
//         placeholder="Search by Tracking ID"
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <div className="container">
//         {(searchResults.length > 0 ? searchResults : products).map(
//           (product) => (
//             <div key={product.id} className="card" id={`card-${product.id}`}>
//               <div className="cname">NameOC</div>
//               <div key={product.id}>
//                 <div className="contenttext">
//                   <h1 className="htitle">Title:</h1>
//                   <h1 className="h1title">{product.title}</h1>
//                 </div>
//                 <div className="contenttext1">
//                   <h1 className="htitle">Price:</h1>{" "}
//                   <h1 className="h1title1">{product.price}</h1>
//                 </div>
//                 <div className="contenttext2">
//                   <h1 className="htitle">Rating:</h1>
//                   <h1 className="h1title2"> {product.rating}</h1>
//                 </div>
//                 <div className="contenttext3">
//                   <h1 className="htitle">Brand:</h1>{" "}
//                   <h1 className="h1title3">{product.brand}</h1>
//                 </div>
//                 <div className="contenttext4">
//                   <h1 className="htitle">Category:</h1>{" "}
//                   <h1 className="h1title4">{product.category}</h1>
//                 </div>
//                 {product.barcodeImage && (
//                   <div>
//                     <img
//                       src={product.barcodeImage}
//                       alt="Barcode"
//                       className="barcode"
//                     />
//                     <div className="trackno">{product.trackingId}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default BarcodeLabelApp;
