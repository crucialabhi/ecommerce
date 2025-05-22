// Example route for getting the dashboard page
import connection from "../database/connection.js";
import generalResponse from "../helpers/generalResponse.js";
import {
  uploadImages,
  uploadVendorProfileImg,
} from "../middleware/multerValidation.js";
import multer from "multer";
import { uploadOnCloude } from "../middleware/cloudinary.js";
import {
  validateVendorProduct,
  validateVendorProfileDetails,
} from "../middleware/joiValidation.js";
import {
  orderrejetctmail,
  AcceptMail,
  RejectMail,
} from "../middleware/nodeMailer.js";

export const getVendorDashboard = (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/dashboard",{vendoremail:vendoremail});
};

export const getProducts = (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/listProducts",{vendoremail:vendoremail});
};

export const showAllProducts = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [showProductsResult] = await connection.query(
      `SELECT * FROM vendor_product_details where vendor_id = ? AND is_deleted = 0`,
      [vendorId]
    );
    return res.status(200).json(
      generalResponse("show vendor details", {
        success: true,
        showProductsResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getOrderChartData = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [orderChartDetails] = await connection.query(
      `select products_name , COUNT(order_id) AS TotalOrders FROM products LEFT JOIN order_details on products.products_id = order_details.product_id WHERE vendor_id = ? GROUP BY products.products_name `,
      [vendorId]
    );
    //     const [orderChartDetails] = await connection.query(`select vendor_product_details.product_name , COUNT(order_id) AS TotalOrders FROM products LEFT JOIN order_details on products.products_id = order_details.product_id 
    // LEFT JOIN vendor_product_details on vendor_product_details.vendor_product_id = products.vendor_product_id
    // WHERE vendor_product_details.vendor_id = ? GROUP BY products.vendor_product_id`,[vendorId])

    return res.status(200).json(
      generalResponse("Details of Order chart", {
        success: true,
        orderChartDetails,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getInventoryChartData = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getInventoryChartData] = await connection.query(
      `select product_name , available_stock from vendor_product_details where vendor_id = ? and is_deleted = 0`,
      [vendorId]
    );
    return res.status(200).json(
      generalResponse("Details of Inventory chart", {
        success: true,
        getInventoryChartData,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getShippingData = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [shippingStatusResult] = await connection.query(
      `select order_status , COUNT(order_details.order_id) as totalorders FROM order_details  WHERE order_details.vendor_id = ? GROUP BY order_status`,
      [vendorId]
    );
    return res.status(200).json(
      generalResponse("Details of Shipping status", {
        success: true,
        shippingStatusResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const addProducts = (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/addProducts",{vendoremail:vendoremail});
};

export const getCategories = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    // You can modify the query to fetch categories based on your requirements
    const query = `SELECT * FROM categories WHERE cat_id = (SELECT cat_id FROM vendor_details WHERE vendor_id = ?)`;
    const [categoryResult] = await connection.query(query, [vendorId]);

    return res.status(200).json(
      generalResponse("Main category detail", {
        success: true,
        categoryResult,
      })
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json(
      generalResponse("An error occurred while fetching categories.", {
        success: false,
      })
    );
  }
};

export const getSubCategory = async (req, res) => {
  try {
    const query1 = `SELECT * FROM categories where parent_cat_id = ${req.body.category_id}`;
    const [subCategoryResult] = await connection.query(query1);
    return res.status(200).json(
      generalResponse("sub category detail", {
        success: true,
        subCategoryResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const productsData = async (req, res) => {
  uploadImages(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      //   code: 'LIMIT_UNEXPECTED_FILE',
      console.log("multer err:", err);

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json(
          generalResponse("You can upload a maximum of 10MB images total.", {
            success: false,
          })
        );
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json(
          generalResponse("You can upload a maximum of 5 images.", {
            success: false,
          })
        );
      }
    } else if (err) {
      // An unknown error occurred when uploading.
      //fileFilter error

      console.log("unknown err:", err);
      return res.status(400).json(
        generalResponse(
          "Invalid file type, only PNG, JPG and JPEG is allowed",
          {
            success: false,
          }
        )
      );
    }

    // Everything went fine
    //Validate Empty image
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json(generalResponse("Please upload images.", { success: false }));
    }

    // Validate product data using Joi
    const validation = await validateVendorProduct(req.body);
    if (validation.error) {
      const messageOfError = validation.error.details[0]["message"];
      return res
        .status(400)
        .json(generalResponse(messageOfError, { success: false }));
    }

    //upload images to cloudinary
    let fileArray = req.files;

    let allImageUrlString = "";
    for (let i = 0; i < fileArray.length; i++) {
      let path = fileArray[i].path;

      let image = await uploadOnCloude(path);

      if (i == 0) {
        allImageUrlString = image.secure_url;
      } else {
        allImageUrlString += `,${image.secure_url}`;
      }
    }

    let vendorId = req.vendorDetails.vendor_id;
    let data = req.body;
    try {
      const query = `SELECT cat_name FROM categories WHERE cat_id = ? or cat_id = ? or cat_id = ? or cat_id = ?`;
      const [SelectCatNameResult] = await connection.query(query, [
        data.category,
        data.subCategory1,
        data.subCategory2,
        data.subCategory3,
      ]);

      const parentCatName = SelectCatNameResult[0].cat_name;

      let searching_tags = `${SelectCatNameResult[0].cat_name},${SelectCatNameResult[1].cat_name},${SelectCatNameResult[2].cat_name},${SelectCatNameResult[3].cat_name},${data.title}`;

      const query1 = `INSERT INTO vendor_product_details (category_id, parent_cat_name, vendor_id, product_name, stock, price, available_stock, description, image_path, size, color, searching_tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [insertVendorProductResult] = await connection.query(query1, [
        data.category,
        parentCatName,
        vendorId,
        data.title,
        data.stock,
        data.price,
        data.stock,
        data.description,
        allImageUrlString,
        data.size,
        data.color,
        searching_tags,
      ]);
      let vendorProductId = insertVendorProductResult.insertId;

      const query2 = `INSERT INTO products (products_name, vendor_product_id, description) VALUES (?, ?, ?)`;

      for (let i = 0; i < data.stock; i++) {
        var [insertProductResult] = await connection.query(query2, [
          data.title,
          vendorProductId,
          data.description,
        ]);
      }

      const query3 = `INSERT INTO vendor_stock_history (vendor_product_id, total_previous_stock, total_available_stock, added_stock, price) VALUES (?, ?, ?, ?, ?)`;

      const [insertVendorStockHistoryResult] = await connection.query(query3, [
        vendorProductId,
        0,
        data.stock,
        0,
        data.price,
      ]);

      return res
        .status(200)
        .json(generalResponse("product added successfully", { success: true }));
    } catch (error) {
      console.log(error);
      res.status(400).json(generalResponse("Something went wrong"));
    }
  });
};

export const renderEditProduct = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/editProduct",{vendoremail:vendoremail});
};

export const getProductDetail = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    let vendorProductID = req.query.vendorProductID;
    const [editProductDeatilResult] = await connection.query(
      `select * from vendor_product_details where vendor_product_id = ? AND vendor_id = ?`,
      [vendorProductID, vendorId]
    );
    return res.status(200).json(
      generalResponse("Details of Product", {
        success: true,
        editProductDeatilResult: editProductDeatilResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const postProductDetails = async (req, res) => {
  uploadImages(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      //   code: 'LIMIT_UNEXPECTED_FILE',
      console.log("multer err:", err);

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json(
          generalResponse("You can upload a maximum of 10MB images total.", {
            success: false,
          })
        );
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json(
          generalResponse("You can upload a maximum of 5 images.", {
            success: false,
          })
        );
      }
    } else if (err) {
      // An unknown error occurred when uploading.
      //fileFilter error
      console.log("unknown err:", err);
      return res.status(400).json(
        generalResponse(
          "Invalid file type, only PNG, JPG and JPEG is allowed",
          {
            success: false,
          }
        )
      );
    }

    const data = req.body;
    const vendorProductID = req.query.vendorProductID;

    try {
      // Update vendor product details
      //upload updated images to cloudinary
      let fileArray = req.files;

      if (fileArray.length > 0) {
        let allImageUrlString = "";
        for (let i = 0; i < fileArray.length; i++) {
          let path = fileArray[i].path;

          let image = await uploadOnCloude(path);

          if (i == 0) {
            allImageUrlString = image.secure_url;
          } else {
            allImageUrlString += `,${image.secure_url}`;
          }
        }

        let updateVendorProductDetails = `UPDATE vendor_product_details SET product_name = ?, description = ?, image_path = ?, updated_at = ? WHERE vendor_product_id = ?`;
        await connection.query(updateVendorProductDetails, [
          data.title,
          data.description,
          allImageUrlString,
          new Date(),
          vendorProductID,
        ]);
      } else {
        let updateVendorProductDetails = `UPDATE vendor_product_details SET product_name = ?, description = ?, updated_at = ? WHERE vendor_product_id = ?`;
        await connection.query(updateVendorProductDetails, [
          data.title,
          data.description,
          new Date(),
          vendorProductID,
        ]);
      }

      // Update products
      await connection.query(
        `UPDATE products SET products_name = ?, description = ? WHERE vendor_product_id = ?`,
        [data.title, data.description, vendorProductID]
      );

      return res.status(200).json(
        generalResponse("Product data updated successfully.", {
          success: true,
        })
      );
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json(
        generalResponse("An error occurred while updating the product.", {
          success: false,
        })
      );
    }
  });
};

export const editStock = async (req, res) => {
  try {
    let vendorProductID = req.body.VendorProductID;
    let inputValue = req.body.inputValue;

    const [selectStockDetail] = await connection.query(
      `select stock , available_stock, price, description, product_name FROM vendor_product_details where vendor_product_id = ?`,
      [vendorProductID]
    );

    let stock = selectStockDetail[0].stock;
    let available_stock = selectStockDetail[0].available_stock;
    let price = selectStockDetail[0].price;
    let description = selectStockDetail[0].description;
    let product_name = selectStockDetail[0].product_name;

    const [insertStockHistory] = await connection.query(
      `insert into vendor_stock_history(vendor_product_id , total_previous_stock , total_available_stock , added_stock ,price) VALUES(?,?,?,?,?)`,
      [vendorProductID, stock, available_stock, inputValue, price]
    );

    const [updateStock] = await connection.query(
      `update vendor_product_details SET stock = stock + ${inputValue} ,available_stock = available_stock + ${inputValue}  where vendor_product_id = ?`,
      [vendorProductID]
    );

    const insertProduct = `INSERT INTO products (products_name, vendor_product_id, description) VALUES (?, ?, ?)`;

    for (let i = 0; i < inputValue; i++) {
      var [insertProductResult] = await connection.query(insertProduct, [
        product_name,
        vendorProductID,
        description,
      ]);
    }

    return res
      .status(200)
      .json(generalResponse("Added stock successfully", { success: true }));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const updatePrice = async (req, res) => {
  try {
    let vendorProductID = req.body.VendorProductID;
    let inputValue = req.body.inputValue;
    let vendorId = req.vendorDetails.vendor_id;

    const [selectStockDetail] = await connection.query(
      `select stock , available_stock, price, description, product_name FROM vendor_product_details where vendor_product_id = ? and vendor_id = ?`,
      [vendorProductID, vendorId]
    );

    let stock = selectStockDetail[0].stock;
    let available_stock = selectStockDetail[0].available_stock;

    const [insertStockHistory] = await connection.query(
      `insert into vendor_stock_history (vendor_product_id , total_previous_stock , total_available_stock , added_stock ,price) VALUES(?,?,?,?,?)`,
      [vendorProductID, stock, available_stock, 0, inputValue]
    );

    const [updateStock] = await connection.query(
      `update vendor_product_details SET price = ?  where vendor_product_id = ? and vendor_id = ?`,
      [inputValue, vendorProductID, vendorId]
    );

    return res
      .status(200)
      .json(generalResponse("Price updated successfully", { success: true }));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const showOrderDetails = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/showOrders",{vendoremail:vendoremail});
};

export const getALlOrderDetails = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [orderDetailResult] = await connection.query(
      `SELECT order_details.order_id , order_date AS "Order Date",order_status AS "Order Status",delivery_date AS "Order Delivery Date ", products.products_name AS "Product Name" , user_table.first_name AS "First Name" , user_table.last_name AS "Last Name",user_table.email AS "Email",user_address_table.address AS "Address", user_address_table.city AS "City",user_address_table.state AS "State" from ecommerce.order_details LEFT join ecommerce.products on order_details.product_id = products.products_id 
LEFT join user_table on order_details.user_id = user_table.user_id
LEFT join user_address_table on order_details.address_id = user_address_table.address_id
where vendor_id = ?`,
      [vendorId]
    );
    return res.status(200).json(
      generalResponse("Details of Order", {
        success: true,
        orderDetailResult: orderDetailResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("something went wrong"));
  }
};

export const getSales = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/showSales",{vendoremail:vendoremail});
};

export const getMonthWiseSalesData = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getMonthSales] = await connection.query(
      `select
        monthname(min(order_date)) as month_name,
        sum(product_price) as "TotalSales",
        sum(admin_commission) as 'TotalComission',
        (sum(product_price)) - (sum(admin_commission)) AS MonthlyRevenue
        from
        order_details
        where year(order_date) = year(curdate()) and vendor_id = ? and order_status = ?
        group by month(order_date)
        order by month(order_date)`,
      [vendorId, "complete"]
    );

    res.status(200).json(
      generalResponse("Details of Month wise sales", {
        success: true,
        getMonthSales: getMonthSales,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getCityWiseSalesData = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getCitySalesData] = await connection.query(
      `select sum(product_price) as "Total_sales_of_city" , city  from order_details 
left join user_table on order_details.user_id = user_table.user_id
left join user_address_table on order_details.user_id = user_address_table.user_id 
where vendor_id = ? and order_status = ?
group by(city)`,
      [vendorId, "complete"]
    );

    res.status(200).json(
      generalResponse("Details of Sales of city", {
        success: true,
        getCitySalesData: getCitySalesData,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getProfilePage = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/Profile",{vendoremail:vendoremail});
};

export const getProfileDetails = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [profileDetails] = await connection.query(
      `select first_name , last_name , mobile_number, is_active,company_name,vendor_img from vendor_details where vendor_id = ?`,
      [vendorId]
    );

    res.status(200).json(
      generalResponse("Profile details of Logged in vendor", {
        success: true,
        profileDetails: profileDetails,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const editProfileDetails = async (req, res) => {
  uploadVendorProfileImg(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("unknown err:", err);
      return res.status(400).json(
        generalResponse(
          "Invalid file type, only PNG, JPG and JPEG is allowed",
          {
            success: false,
          }
        )
      );
    }
    let vendorId = req.vendorDetails.vendor_id;
    let data = req.body;
    const validation = await validateVendorProfileDetails(req.body);
    if (validation.error) {
      const messageOfError = validation.error.details[0]["message"];
      return res
        .status(400)
        .json(generalResponse(messageOfError, { success: false }));
    }

    if (req.file?.path) {
      const cloudinaryResponse = await uploadOnCloude(req.file.path);

      let file = req.file;

      const [updateProfile] = await connection.query(
        `update vendor_details set first_name = ? , last_name = ?, mobile_number = ?, company_name = ?,vendor_img = ? where vendor_id = ?`,
        [
          data.fname,
          data.lname,
          data.MobileNum,
          data.companyName,
          cloudinaryResponse.url,
          vendorId,
        ]
      );
      res.status(400).json(
        generalResponse("Updated Profile details", {
          success: true,
          updateProfile: updateProfile,
        })
      );
    } else {
      const [updateProfile] = await connection.query(
        `update vendor_details set first_name = ? , last_name = ?, mobile_number = ?, company_name = ? where vendor_id = ?`,
        [data.fname, data.lname, data.MobileNum, data.companyName, vendorId]
      );
      res.status(400).json(
        generalResponse("Updated Profile details", {
          success: true,
          updateProfile: updateProfile,
        })
      );
    }
  });
};

export const filterResult = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    let FilterValue = req.query.FilterValue;
    if (FilterValue == "") {
      var filterQuery = `SELECT order_details.order_id, order_date AS "Order Date",order_status AS "Order Status",delivery_date AS "Order Delivery Date ", products.products_name AS "Product Name", user_table.first_name AS "First Name", user_table.last_name AS "Last Name",user_table.email AS "Email", user_address_table.address AS "Address", user_address_table.city AS "City",user_address_table.state AS "State" from ecommerce.order_details LEFT join ecommerce.products on order_details.product_id = products.products_id 
LEFT join user_table on order_details.user_id = user_table.user_id
LEFT join user_address_table on order_details.address_id = user_address_table.address_id
where vendor_id = ?`;
      var [FilterResult] = await connection.query(filterQuery, [vendorId]);
    } else {
      var filterQuery = `SELECT order_details.order_id, order_date AS "Order Date",order_status AS "Order Status",delivery_date AS "Order Delivery Date ", products.products_name  AS "Product Name", user_table.first_name AS "First Name", user_table.last_name AS "Last Name",user_table.email AS "Email",user_address_table.address AS "Address", user_address_table.city AS "City",user_address_table.state AS "State" from ecommerce.order_details LEFT join ecommerce.products on order_details.product_id = products.products_id 
LEFT join user_table on order_details.user_id = user_table.user_id
LEFT join user_address_table on order_details.address_id = user_address_table.address_id
where vendor_id = ? and order_status = ? `;
      var [FilterResult] = await connection.query(filterQuery, [
        vendorId,
        FilterValue,
      ]);
    }

    res.status(400).json(
      generalResponse("Filter result", {
        success: true,
        FilterResult: FilterResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getcontacttoadmin = async (req, res) => {
  try {
  let vendoremail = req.vendorDetails.email;
    return res.render("vendor/contacttoadmin",{vendoremail:vendoremail});
  } catch (error) {
    return res.status(404).json(generalResponse(error.message));
  }
};

export const postcontacttoadmin = async (req, res) => {
  try {
    // fetch vendorname using middleware
    let vendor = req.vendorDetails.email;

    let query = `INSERT INTO notification_details(notification_created_by,notification_for,notification_subject,notification_content)
        VALUES
        ("${vendor}","${req.body.admin}","${req.body.Subject}","${req.body.Content}")`;
    let [createnotificationn] = await connection.query(query);
    return res.status(200).json(generalResponse("notification sended"));
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};
export const getnotifications = async (req, res) => {
  try {
    let vendoremail = req.vendorDetails.email;
    return res.render("vendor/notifications",{vendoremail:vendoremail});
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};

export const getincomingnotification = async (req, res) => {
  try {
  let vendoremail = req.vendorDetails.email;
    return res.render("admin/incomingnotification",{vendoremail:vendoremail});
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};

export const fetchnotificationsforvendorreaded = async (req, res) => {
  try {
    // fetch vendor using jwt decoding
    let vendor = req.vendorDetails.email;
    let query = `select * from notification_details where (notification_for = "${vendor}" or notification_for = "all") and notification_is_readed= "1"`;
    let [fetchnotificationsforadminn] = await connection.query(query);
    return res
      .status(200)
      .json(
        generalResponse("notifications fetched", fetchnotificationsforadminn)
      );
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};
export const fetchnotificationsforvendorunreaded = async (req, res) => {
  try {
    let vendor = req.vendorDetails.email;
    let query = `select * from notification_details where (notification_for = "${vendor}" or notification_for = "all") and notification_is_readed= "0"`;
    let [fetchnotificationsforadminn] = await connection.query(query);
    return res
      .status(200)
      .json(
        generalResponse("notifications fetched", fetchnotificationsforadminn)
      );
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};

export const postmarkasread = async (req, res) => {
  try {
    let query = `UPDATE notification_details SET notification_is_readed = "1" where notification_id = "${req.body.id}"`;
    let [markasreadmsg] = await connection.query(query);
    return res.status(200).json(generalResponse("success"));
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};
export const postmarkasreadall = async (req, res) => {
  try {
    // fetch vendor using jwt decoding
    let vendor = req.vendorDetails.email;
    let query = `UPDATE notification_details SET notification_is_readed = "1" where notification_for = "${vendor}"`;
    let [markasreadmsg] = await connection.query(query);
    return res
      .status(200)
      .json(generalResponse("all notification marked as readed"));
  } catch (error) {
    console.log(error);
    return res.status(404).json(generalResponse(error.message));
  }
};

export const pendingVerification = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/pendingVerification",{vendoremail:vendoremail});
};

export const checkVerification = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    let checkVerificationStatusQuery =
      "SELECT is_verified FROM vendor_details WHERE vendor_id = ?";
    const [verificationResult] = await connection.query(
      checkVerificationStatusQuery,
      [vendorId]
    );

    res.status(200).json(
      generalResponse("verification status", {
        success: true,
        verificationResult: verificationResult[0].is_verified,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const returnRequest = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/ReturnRequest",{vendoremail:vendoremail});
};

export const returnRequestDetails = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [returnRequestDetails] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ?`,
      ["pending", vendorId]
    );
    res.status(200).json(
      generalResponse("Return request details", {
        success: true,
        returnRequestDetails: returnRequestDetails,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const AcceptReturnRequest = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [returnRequestDetails] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, 
  user_table.first_name,user_table.last_name , user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ?`,
      ["pending", vendorId]
    );


    AcceptMail(returnRequestDetails);
    let refundIdAccept = req.body.acceptBtnID;
    const [refundStatusUpdate] = await connection.query(
      `update refund_details set refund_status = "complete" where refund_id = ?`,
      [refundIdAccept]
    );

    const [orderFetchResult] = await connection.query(
      `select order_id from refund_details where refund_id = ?`,
      [refundIdAccept]
    );

    const [updateStatus] = await connection.query(`UPDATE order_details SET order_status = 'refunded' WHERE order_id = ?`, [orderFetchResult[0].order_id]);

    const [updatePaymentTable] = await connection.query(`update payment_table set is_refund = ? where order_id = ?`, [1, orderFetchResult[0].order_id])
    const [productIdFetchResult] = await connection.query(
      `select product_id from order_details where order_id = ?`,
      [orderFetchResult[0].order_id]
    );
    const [productTableUpdate] = await connection.query(
      `update products set is_sold = 0 where products_id = ?`,
      productIdFetchResult[0].product_id
    );
    const [updateAvailableStock] = await connection.query(
      `UPDATE vendor_product_details SET available_stock = available_stock + 1 WHERE vendor_product_id = (SELECT vendor_product_id FROM products WHERE products_id = ?)`,
      [productIdFetchResult[0].product_id]
    );
    res
      .status(200)
      .send(generalResponse("Return request accepted", { success: true }));
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const RejectReturnRequest = async (req, res) => {
  try {
    let refundIDReject = req.body.RejectBtnID;
    let vendorId = req.vendorDetails.vendor_id;

    const [returnRequestDetails] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, 
  user_table.first_name,user_table.last_name , user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ?`,
      ["pending", vendorId]
    );


    RejectMail(returnRequestDetails);

    const [updateRejectStatus] = await connection.query(
      `update refund_details set refund_status = "Rejected" where refund_id = ?`,
      [refundIDReject]
    );
    res
      .status(200)
      .send(generalResponse("Rejected Return Request", { success: true }));
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("Something went wrong"));
  }
};

export const RenderOrderRequests = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  res.render("vendor/orderRequests",{vendoremail:vendoremail});
};

export const getOrderRequests = async (req, res) => {
  let vendoremail = req.vendorDetails.email;
  try {
    let vendorId = req.vendorDetails.vendor_id;
    let orderRequestsQuery = `SELECT od.order_id, od.product_id, od.group_id, ut.email, vpd.product_name, od.product_price, od.order_date, uat.address, uat.pin_code, uat.city  FROM order_details od JOIN products p ON od.product_id = p.products_id JOIN user_address_table uat ON od.address_id = uat.address_id JOIN user_table ut ON ut.user_id = uat.user_id JOIN vendor_product_details vpd ON vpd.vendor_product_id = p.vendor_product_id WHERE od.order_status = 'vendorVerification' AND vpd.vendor_id = ? ORDER BY od.order_date DESC`;

    const [orderRequestsQueryResult] = await connection.query(
      orderRequestsQuery,
      [vendorId]
    );

    res.status(200).json(
      generalResponse("order requests data", {
        success: true,
        orderRequestsData: orderRequestsQueryResult,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("something went wrong", { success: false }));
  }
};

export const acceptOrder = async (req, res) => {
  try {
    let orderId = req.query.orderId;
    let acceptOrderQuery = `UPDATE order_details SET order_status = 'pending' WHERE order_id = ?`;

    const [acceptOrderQueryResult] = await connection.query(acceptOrderQuery, [
      orderId,
    ]);

    res.status(200).json(
      generalResponse("order accepted", {
        success: true,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("something went wrong", { success: false }));
  }
};

export const acceptAllOrder = async (req, res) => {
  try {
    let groupId = req.query.groupId;
    let vendorId = req.vendorDetails.vendor_id;
    let acceptAllOrderQuery = `UPDATE order_details SET order_status = 'pending' WHERE group_id = ? AND vendor_id = ?`;

    const [acceptOrderQueryResult] = await connection.query(
      acceptAllOrderQuery,
      [groupId, vendorId]
    );

    res.status(200).json(
      generalResponse("all order accepted", {
        success: true,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("something went wrong", { success: false }));
  }
};

export const rejectOrder = async (req, res) => {
  try {
    let orderId = req.query.orderId;
    let productId = req.query.productId;
    let updateOrderStatusQuery = `UPDATE order_details SET order_status = 'rejected' WHERE order_id = ?`;

    const [updateOrderStatusQueryResult] = await connection.query(
      updateOrderStatusQuery,
      [orderId]
    );

    let updateIsSoldQuery = `UPDATE products SET is_sold = 0 WHERE products_id = ?`;

    const [updateIsSoldQueryResult] = await connection.query(
      updateIsSoldQuery,
      [productId]
    );

    let updateStockQuery = `UPDATE vendor_product_details SET available_stock = available_stock + 1 WHERE vendor_product_id = (SELECT vendor_product_id FROM products WHERE products_id = ?)`;

    const [updateStockQueryResult] = await connection.query(updateStockQuery, [
      productId,
    ]);
    // send mail on order rejection by vendor
    let query = `select email from user_table left join order_details on user_table.user_id =order_details.user_id where order_details.order_id = ${orderId}`;
    let [Email] = await connection.query(query);
    let mail = Email[0].email;
    orderrejetctmail(mail);

    res.status(200).json(
      generalResponse("order rejected", {
        success: true,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("something went wrong", { success: false }));
  }
};

export const returnRequestHistory = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [returnRequestHistoryDetails] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.refund_status,refund_details.payment_id, 
order_details.order_date, order_details.delivery_date, 
products.products_name, 
user_table.first_name,user_table.last_name 
from refund_details
left join order_details on refund_details.order_id = order_details.order_id
left join products on order_details.product_id = products.products_id 
left join user_table on order_details.user_id = user_table.user_id
where refund_status != ?  and order_details.vendor_id = ?`,
      ["pending", vendorId]
    );
    res.status(200).json(
      generalResponse("Return request History details", {
        success: true,
        returnRequestHistoryDetails: returnRequestHistoryDetails,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const showTrendingProducts = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTrendingProducts] = await connection.query(
      `select vendor_product_details.product_name , vendor_product_details.price , COUNT(order_id) AS TotalOrders FROM products 
LEFT JOIN order_details on products.products_id = order_details.product_id 
left join vendor_product_details on  products.vendor_product_id = vendor_product_details.vendor_product_id 
WHERE order_details.vendor_id = ? and order_details.order_status = ? group by products.vendor_product_id order by TotalOrders DESC`,
      [vendorId, "complete"]
    );
    res
      .status(200)
      .json(
        generalResponse("Trending Products Detail", {
          success: true,
          getTrendingProducts: getTrendingProducts,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

export const getTotalOrderCount = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [totalOrderCount] = await connection.query(
      `select COUNT(order_details.order_id) AS "TotalOrders" FROM order_details where vendor_id = ?`,
      [vendorId]
    );
    res
      .status(200)
      .json(
        generalResponse("Total Orders of Vendor", {
          success: true,
          totalOrderCount: totalOrderCount,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

export const getTotalProducts = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [totalProductCount] = await connection.query(
      `select count(vendor_product_id) as "TotalProducts" from vendor_product_details where vendor_id = ?`,
      [vendorId]
    );
    res
      .status(200)
      .json(
        generalResponse("Total Orders of Vendor", {
          success: true,
          totalProductCount: totalProductCount,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;

    const [totalRevenue] = await connection.query(
      `select sum(product_price) as "TotalRevenue" from order_details where vendor_id = ? AND order_status = ?`,
      [vendorId, "complete"]
    );

    res
      .status(200)
      .json(
        generalResponse("Total Orders of Vendor", {
          success: true,
          totalRevenue: totalRevenue,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

export const getTotalPendingOrders = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [totalPendingOrders] = await connection.query(
      `select count(order_id) as "TotalPendingOrders" from order_details where order_status = "vendorVerification" and vendor_id = ?`,
      [vendorId]
    );
    res
      .status(200)
      .json(
        generalResponse("Total Orders of Vendor", {
          success: true,
          totalPendingOrders: totalPendingOrders,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

export const getSearchedProduct = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    let searchValue = req.query.SearchValue;
    let lowerCaseSearchVAlue = searchValue.toLowerCase();

    const [showSearchProductsResult] = await connection.query(
      `SELECT * FROM vendor_product_details where product_name LIKE '%${lowerCaseSearchVAlue}%' AND vendor_id = ?`,
      [vendorId]
    );

    return res.status(200).json(
      generalResponse("show vendor details", {
        success: true,
        showSearchProductsResult,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    let deleteButtonID = req.query.deleteId

    const [deleteFromVPD] = await connection.query(
      `update vendor_product_details set is_deleted = ? where vendor_product_id = ?`,
      [1, deleteButtonID]
    );
    const [deleteFromProducts] = await connection.query(
      `update products set is_deleted = ? where vendor_product_id = ?`,
      [1, deleteButtonID]
    );
    const [deleteFromVSH] = await connection.query(
      `update vendor_stock_history set is_deleted = ? where vendor_product_id = ?`,
      [1, deleteButtonID]
    );
    res.status(200).send(generalResponse("delete products", { success: true }));
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(generalResponse("Something went wrong", { success: false }));
  }
};

var record_per_page = 9;
var initial_offset = 0;
export const getFirstNineProducts = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTotalRecords] = await connection.query(
      `SELECT COUNT(*) AS total FROM vendor_product_details where vendor_id = ? AND is_deleted = 0`,
      [vendorId]
    );
    const total_records = getTotalRecords[0].total;
    const total_pages = Math.ceil(total_records / record_per_page);

    const [getFirstNineProducts] = await connection.query(
      `SELECT * FROM vendor_product_details where vendor_id = ? AND is_deleted = 0 LIMIT ` +
      record_per_page,
      [vendorId]
    );

    res.status(200).json(
      generalResponse("get first nine products", {
        success: true,
        getFirstNineProducts,
        current_page: 1,
        total_pages: total_pages,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getRemainingProducts = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTotalRecords] = await connection.query(
      `SELECT COUNT(*) AS total FROM vendor_product_details where vendor_id = ? AND is_deleted = 0`,
      [vendorId]
    );
    const total_records = getTotalRecords[0].total;
    const total_pages = Math.ceil(total_records / record_per_page);

    if ('Previous_page' in req.body) {
      if (initial_offset > 0) {
        initial_offset -= record_per_page;
      }
    } else if ('Next_page' in req.body) {
      initial_offset += record_per_page;
      if (initial_offset >= total_records) {
        initial_offset -= record_per_page;
      }
    } else if ('Last_page' in req.body) {
      initial_offset = (total_pages - 1) * record_per_page;
    } else if ('First_Page' in req.body) {
      initial_offset = 0;
    }

    const [getRemainingProducts] = await connection.query(`SELECT * FROM vendor_product_details where vendor_id = ? AND is_deleted = 0 LIMIT ${record_per_page} OFFSET ${initial_offset}`, [vendorId])
    res.status(200).json(
      generalResponse("get remaining products", {
        success: true,
        getRemainingProducts,
        current_page: Math.ceil(initial_offset / record_per_page) + 1,
        total_pages: total_pages
      })
    );


  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const getFirstNineRequest = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTotalRequests] = await connection.query(
      `select count(order_details.vendor_id) as "total"
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ? 
  group by order_details.vendor_id `,
      ["pending", vendorId]
    );
    const total_records = getTotalRequests[0].total;
    const total_pages = Math.ceil(total_records / record_per_page);

    const [getFirstNineRequests] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ? LIMIT ` +
      record_per_page,
      ["pending", vendorId]
    );
    res.status(200).json(
      generalResponse("Return request details", {
        success: true,
        getFirstNineRequests,
        current_page: 1,
        total_pages: total_pages,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const getRemainingRequest = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTotalRequests] = await connection.query(
      `select count(order_details.vendor_id) as "total"
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ? 
  group by order_details.vendor_id `,
      ["pending", vendorId]
    );
    const total_records = getTotalRequests[0].total;
    const total_pages = Math.ceil(total_records / record_per_page);

    if ("Previous_page" in req.body) {
      if (initial_offset > 0) {
        initial_offset -= record_per_page;
      }
    } else if ("Next_page" in req.body) {
      initial_offset += record_per_page;
      if (initial_offset >= total_records) {
        initial_offset -= record_per_page;
      }
    } else if ("Last_page" in req.body) {
      initial_offset = (total_pages - 1) * record_per_page;
    } else if ("First_Page" in req.body) {
      initial_offset = 0;
    }

    const [getRemainingRequests] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status = ? and order_details.vendor_id = ? LIMIT ${record_per_page} OFFSET ${initial_offset}`, ["pending", vendorId])
    res.status(200).json(
      generalResponse("get remaining products", {
        success: true,
        getRemainingRequests,
        current_page: Math.ceil(initial_offset / record_per_page) + 1,
        total_pages: total_pages
      })
    );

  } catch (error) {
    console.log(error);
  }


}






export const getNineRequestHIstory = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTotalRequests] = await connection.query(
      `select count(order_details.vendor_id) as "total"
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status != ? and order_details.vendor_id = ? 
  group by order_details.vendor_id `,
      ["pending", vendorId]
    );
    const total_records = getTotalRequests[0].total;
    const total_pages = Math.ceil(total_records / record_per_page);

    const [getFirstNineRequestsHistory] = await connection.query(
      `select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status != ? and order_details.vendor_id = ? LIMIT ` + record_per_page,
      ["pending", vendorId]
    );
    res.status(200).json(
      generalResponse("Return request details", {
        success: true,
        getFirstNineRequestsHistory,
        current_page: 1,
        total_pages: total_pages
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }

}


export const getRemainingRequestHistory = async (req, res) => {
  try {
    let vendorId = req.vendorDetails.vendor_id;
    const [getTotalRequests] = await connection.query(
      `select count(order_details.vendor_id) as "total"
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status != ? and order_details.vendor_id = ? 
  group by order_details.vendor_id `,
      ["pending", vendorId]
    );
    const total_records = getTotalRequests[0].total;
    const total_pages = Math.ceil(total_records / record_per_page);


    if ('Previous_page' in req.body) {
      if (initial_offset > 0) {
        initial_offset -= record_per_page;
      }
    } else if ('Next_page' in req.body) {
      initial_offset += record_per_page;
      if (initial_offset >= total_records) {
        initial_offset -= record_per_page;
      }
    } else if ('Last_page' in req.body) {
      initial_offset = (total_pages - 1) * record_per_page;
    } else if ('First_Page' in req.body) {
      initial_offset = 0;
    }

    const [getRemainingRequests] = await connection.query(`select refund_details.refund_id, refund_details.requested_at, refund_details.payment_id, 
  order_details.order_date, order_details.delivery_date, 
  products.products_name, user_table.email
  from refund_details
  left join order_details on refund_details.order_id = order_details.order_id
  left join products on order_details.product_id = products.products_id 
  left join user_table on refund_details.user_id = user_table.user_id
  where refund_status != ? and order_details.vendor_id = ? LIMIT ${record_per_page} OFFSET ${initial_offset}`, ["pending", vendorId])
    res.status(200).json(
      generalResponse("get remaining products", {
        success: true,
        getRemainingRequests,
        current_page: Math.ceil(initial_offset / record_per_page) + 1,
        total_pages: total_pages
      })
    );

  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("Something went wrong"))
  }

}



export const logout = async (req, res) => {
  try {
    res.clearCookie("vendorToken");
    res.redirect("/auth/vendor-login");
  } catch (error) {
    res.send(error);
  }
};

export const updateVendorStatusApi = async (req, res) => {


  try {
    let vendorId = req.vendorDetails.vendor_id;
    let active_value = 0
    if (req.body.status == 'Deactivate your account') {
      active_value = 0
    } else {
      active_value = 1
    }

    let updateStatusQryinVendorTable = `UPDATE vendor_details SET is_active = ${active_value} WHERE vendor_id = ${vendorId}`;

    await connection.query(updateStatusQryinVendorTable);

    let updateStatusQryinVendorProductsTable = `UPDATE vendor_product_details SET is_active = ${active_value} WHERE vendor_id = ${vendorId}`;

    await connection.query(updateStatusQryinVendorProductsTable)

    res.status(200).json(generalResponse(req.body.status))

  } catch (error) {
    console.log(error);
  }


}
