const { sequelize, User, Category, Manufacturer, Supplier, Wholesaler, Retailer, Client, Product, Order, OrderItem, Shipment } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Check if users exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('Database already seeded');
      process.exit(0);
    }

    // Create users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@shivascm.com',
      password: 'admin123',
      full_name: 'Admin User',
      role: 'admin',
    });

    const managerUser = await User.create({
      username: 'manager',
      email: 'manager@shivascm.com',
      password: 'manager123',
      full_name: 'Manager User',
      role: 'manager',
    });

    console.log('Users created');

    // Create categories
    const cat1 = await Category.create({
      category_code: 'CAT-2025-0001',
      name: 'Building Materials',
      description: 'Cement, Steel, Sand, Aggregates',
      icon: '🏗️',
      color_hex: '#00b4a0',
    });

    const cat2 = await Category.create({
      category_code: 'CAT-2025-0002',
      name: 'Electrical',
      description: 'Wires, Cables, Switchgear',
      icon: '⚡',
      color_hex: '#f59e0b',
    });

    console.log('Categories created');

    // Create manufacturers
    const mfg1 = await Manufacturer.create({
      manufacturer_id: 'MFG-2025-0001',
      company_name: 'Shree Cements Ltd',
      contact_person: 'Rajesh Sharma',
      email: 'sales@shreecements.com',
      phone: '+91-9876543210',
      address: '123 Industrial Area',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      pincode: '380001',
      gstin: '27AABCS1234H1Z0',
      pan_number: 'AABCS1234H',
      product_categories: [cat1.id],
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const mfg2 = await Manufacturer.create({
      manufacturer_id: 'MFG-2025-0002',
      company_name: 'Tata Steel Limited',
      contact_person: 'Priya Gupta',
      email: 'biz@tatasteel.com',
      phone: '+91-9123456789',
      address: '456 Steel Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400080',
      gstin: '27AATCT5055K1Z0',
      pan_number: 'AATCT5055K',
      product_categories: [cat1.id],
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('Manufacturers created');

    // Create products
    const prod1 = await Product.create({
      product_id: 'PRD-2025-0001',
      product_name: 'Portland Cement 43 Grade',
      product_code: 'CEMENT-43',
      category_id: cat1.id,
      manufacturer_id: mfg1.id,
      description: 'High quality Portland cement for construction',
      base_price: 350,
      mrp: 400,
      gst_rate: 5,
      hsn_code: '2523',
      min_order_qty: 100,
      lead_time_days: 2,
      stock_quantity: 5000,
      reorder_level: 500,
      unit_of_measure: 'bags',
      quality_grade: 'A',
    });

    const prod2 = await Product.create({
      product_id: 'PRD-2025-0002',
      product_name: 'TMT Steel Bars 12mm',
      product_code: 'STEEL-TMT-12',
      category_id: cat1.id,
      manufacturer_id: mfg2.id,
      description: 'High strength TMT steel reinforcement bars',
      base_price: 650,
      mrp: 750,
      gst_rate: 5,
      hsn_code: '7213',
      min_order_qty: 1,
      lead_time_days: 3,
      stock_quantity: 2000,
      reorder_level: 200,
      unit_of_measure: 'pieces',
      quality_grade: 'A',
    });

    console.log('Products created');

    // Create supplier
    const sup1 = await Supplier.create({
      supplier_id: 'SUP-2025-0001',
      company_name: 'B2B Supplies India',
      contact_person: 'Vikram Singh',
      email: 'contact@b2bsupplies.com',
      phone: '+91-9000000001',
      city: 'Delhi',
      state: 'Delhi',
      gstin: '27AABCU5055K1Z0',
      pan_number: 'AABCU5055K',
      supplier_type: 'primary',
      categories_supplied: [cat1.id, cat2.id],
      credit_limit: 500000,
      credit_period_days: 30,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('Suppliers created');

    // Create wholesaler
    const wsl1 = await Wholesaler.create({
      wholesaler_id: 'WSL-2025-0001',
      company_name: 'Metro Wholesale Pvt Ltd',
      contact_person: 'Arjun Patel',
      email: 'info@metrowholesale.com',
      phone: '+91-9000000002',
      city: 'Pune',
      state: 'Maharashtra',
      gstin: '27AABCW5055K1Z0',
      pan_number: 'AABCW5055K',
      warehouse_locations: ['Pune', 'Nagpur', 'Aurangabad'],
      storage_capacity: 10000,
      product_categories: [cat1.id],
      suppliers_associated: [sup1.id],
      credit_limit: 1000000,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('Wholesalers created');

    // Create retailer
    const rtl1 = await Retailer.create({
      retailer_id: 'RTL-2025-0001',
      company_name: 'Local Hardwares Store',
      contact_person: 'Amit Kumar',
      email: 'amit@localhardwares.com',
      phone: '+91-9000000003',
      city: 'Bangalore',
      state: 'Karnataka',
      store_type: 'physical',
      product_categories: [cat1.id, cat2.id],
      wholesalers_associated: [wsl1.id],
      customer_base_size: 500,
      monthly_volume_approx: 250000,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('Retailers created');

    // Create client
    const cli1 = await Client.create({
      client_id: 'CLT-2025-0001',
      client_type: 'company',
      company_name: 'Construction Pros Inc',
      contact_person: 'Deepak Verma',
      email: 'purchasing@constructionpros.com',
      phone: '+91-9000000004',
      city: 'Bangalore',
      state: 'Karnataka',
      gstin: '27AABCC5055K1Z0',
      pan_number: 'AABCC5055K',
      industry_sector: 'Construction',
      annual_purchase_value: 2000000,
      credit_limit: 500000,
      assigned_retailer_id: rtl1.id,
      loyalty_tier: 'gold',
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('Clients created');

    // Create order
    const order1 = await Order.create({
      order_id: 'ORD-2025-0001',
      order_type: 'purchase',
      status: 'confirmed',
      buyer_type: 'Retailer',
      buyer_id: rtl1.id,
      seller_type: 'Wholesaler',
      seller_id: wsl1.id,
      order_date: new Date(),
      expected_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      delivery_address: { address: 'Bangalore Store', city: 'Bangalore' },
    });

    // Add order items
    await OrderItem.create({
      order_id: order1.id,
      product_id: prod1.id,
      quantity: 500,
      unit_price: 350,
      discount_percent: 5,
      tax_percent: 5,
      tax_amount: 8225,
      line_total: 174225,
    });

    console.log('Orders created');

    // Create shipment
    await Shipment.create({
      shipment_id: 'SHP-2025-0001',
      order_id: order1.id,
      carrier_name: 'Express Logistics',
      vehicle_number: 'GJ01AB1234',
      driver_name: 'Ravi Kumar',
      driver_phone: '+91-9000000005',
      tracking_number: 'TRACK123456',
      dispatch_date: new Date(),
      estimated_arrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'in_transit',
      weight_kg: 5000,
      tracking_events: [
        { status: 'dispatched', timestamp: new Date(), notes: 'Order dispatched from warehouse' },
        { status: 'in_transit', timestamp: new Date(Date.now() + 12 * 60 * 60 * 1000), notes: 'In transit to destination' },
      ],
    });

    console.log('Shipments created');
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
