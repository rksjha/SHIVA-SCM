const { sequelize, User, Category, Manufacturer, Supplier, Wholesaler, Retailer, Client, Product, Order, OrderItem, Shipment } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    // ─── USERS ──────────────────────────────────────────────────────────────
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('ℹ️  Database already seeded — skipping');
      process.exit(0);
    }

    console.log('🌱 Seeding SHIVA SCM database...\n');

    // SCG Team User Accounts
    await User.create({
      username: 'rakesh.jha',
      email: 'rksjha@live.in',
      password: process.env.ADMIN_PASSWORD || 'ShivaSCM@2025',
      full_name: 'Rakesh Jha',
      role: 'admin',
      phone: '+91 9979021275',
    });

    await User.create({
      username: 'admin',
      email: 'admin@shivascm.com',
      password: process.env.ADMIN_PASSWORD || 'ShivaSCM@2025',
      full_name: 'SCG Administrator',
      role: 'admin',
    });

    await User.create({
      username: 'scm.manager',
      email: 'manager@shivascm.com',
      password: process.env.MANAGER_PASSWORD || 'Manager@2025',
      full_name: 'SCM Operations Manager',
      role: 'manager',
    });

    await User.create({
      username: 'accounts',
      email: 'accounts@shivascm.com',
      password: process.env.VIEWER_PASSWORD || 'Accounts@2025',
      full_name: 'Accounts & Finance',
      role: 'viewer',
    });

    await User.create({
      username: 'logistics',
      email: 'logistics@shivascm.com',
      password: process.env.VIEWER_PASSWORD || 'Logistics@2025',
      full_name: 'Logistics Coordinator',
      role: 'viewer',
    });

    console.log('✅ 5 user accounts created:\n');
    console.log('   ┌─────────────────────────────────────────────────────┐');
    console.log('   │  SHIVA SCM — Login Credentials                      │');
    console.log('   ├──────────────────────┬──────────────┬───────────────┤');
    console.log('   │  Email               │  Password    │  Role         │');
    console.log('   ├──────────────────────┼──────────────┼───────────────┤');
    console.log('   │  rksjha@live.in      │  ShivaSCM@   │  Admin        │');
    console.log('   │  admin@shivascm.com  │  2025        │  Admin        │');
    console.log('   │  manager@shivascm.com│  Manager@    │  Manager      │');
    console.log('   │  accounts@shivascm.  │  2025        │  Viewer       │');
    console.log('   │  logistics@shivascm. │  Accounts@   │  Viewer       │');
    console.log('   └──────────────────────┴──────────────┴───────────────┘\n');

    // ─── CATEGORIES ─────────────────────────────────────────────────────────
    const cat1 = await Category.create({
      category_code: 'CAT-2025-0001',
      name: 'Building Materials',
      description: 'Cement, Steel, Sand, Aggregates, Bricks',
      icon: '🏗️',
      color_hex: '#00b4a0',
    });

    const cat2 = await Category.create({
      category_code: 'CAT-2025-0002',
      name: 'Electrical',
      description: 'Wires, Cables, Switchgear, MCBs',
      icon: '⚡',
      color_hex: '#f59e0b',
    });

    const cat3 = await Category.create({
      category_code: 'CAT-2025-0003',
      name: 'Plumbing & Sanitary',
      description: 'PVC Pipes, CPVC, Fittings, Sanitaryware',
      icon: '🔧',
      color_hex: '#3b82f6',
    });

    console.log('✅ Categories created');

    // ─── MANUFACTURERS ──────────────────────────────────────────────────────
    const mfg1 = await Manufacturer.create({
      manufacturer_id: 'MFG-2025-0001',
      company_name: 'Shree Cements Ltd',
      contact_person: 'Rajesh Sharma',
      email: 'sales@shreecements.com',
      phone: '+91-9876543210',
      address: '123 Industrial Area, Phase II',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      pincode: '380001',
      gstin: '24AABCS1234H1Z0',
      pan_number: 'AABCS1234H',
      product_categories: [cat1.id],
      annual_turnover: 50000000,
      employee_count: 250,
      production_capacity: '50,000 MT/month',
      quality_certifications: ['ISO 9001:2015', 'BIS 12269'],
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
      address: '456 Steel Complex, Tardeo',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400034',
      gstin: '27AATCT5055K1Z0',
      pan_number: 'AATCT5055K',
      product_categories: [cat1.id],
      annual_turnover: 200000000,
      employee_count: 1200,
      production_capacity: '1,00,000 MT/month',
      quality_certifications: ['ISO 9001:2015', 'BIS 1786', 'ISI Mark'],
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const mfg3 = await Manufacturer.create({
      manufacturer_id: 'MFG-2025-0003',
      company_name: 'Finolex Cables Ltd',
      contact_person: 'Suresh Nair',
      email: 'sales@finolex.com',
      phone: '+91-9000011111',
      address: '789 MIDC, Pimpri',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411018',
      gstin: '27AACCT5055K1Z0',
      pan_number: 'AACCT5055K',
      product_categories: [cat2.id],
      annual_turnover: 80000000,
      employee_count: 600,
      production_capacity: '10,000 km/month',
      quality_certifications: ['ISO 9001:2015', 'BEE Star Rating'],
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('✅ Manufacturers created');

    // ─── PRODUCTS ────────────────────────────────────────────────────────────
    const prod1 = await Product.create({
      product_id: 'PRD-2025-0001',
      product_name: 'Portland Cement 43 Grade',
      product_code: 'CEMENT-43G',
      category_id: cat1.id,
      manufacturer_id: mfg1.id,
      description: 'High quality OPC 43 Grade Portland cement, ideal for general construction, plastering, and flooring',
      base_price: 350,
      mrp: 400,
      gst_rate: 28,
      hsn_code: '2523',
      min_order_qty: 100,
      lead_time_days: 2,
      stock_quantity: 5000,
      reorder_level: 500,
      unit_of_measure: 'bags (50kg)',
      quality_grade: 'A',
      weight_kg: 50,
    });

    const prod2 = await Product.create({
      product_id: 'PRD-2025-0002',
      product_name: 'TMT Steel Bars 12mm Fe500D',
      product_code: 'STEEL-TMT-12',
      category_id: cat1.id,
      manufacturer_id: mfg2.id,
      description: 'High strength Fe500D grade TMT reinforcement bars, earthquake resistant, corrosion resistant',
      base_price: 58000,
      mrp: 62000,
      gst_rate: 18,
      hsn_code: '7214',
      min_order_qty: 1,
      lead_time_days: 3,
      stock_quantity: 500,
      reorder_level: 50,
      unit_of_measure: 'MT (metric ton)',
      quality_grade: 'A+',
      weight_kg: 1000,
    });

    const prod3 = await Product.create({
      product_id: 'PRD-2025-0003',
      product_name: 'River Sand (M-Sand)',
      product_code: 'SAND-M',
      category_id: cat1.id,
      manufacturer_id: mfg1.id,
      description: 'Manufactured sand (M-sand), washed and graded for plastering and concrete',
      base_price: 1200,
      mrp: 1500,
      gst_rate: 5,
      hsn_code: '2505',
      min_order_qty: 1,
      lead_time_days: 1,
      stock_quantity: 200,
      reorder_level: 20,
      unit_of_measure: 'brass',
      quality_grade: 'A',
    });

    const prod4 = await Product.create({
      product_id: 'PRD-2025-0004',
      product_name: 'Finolex FRLS Wire 2.5 sq.mm',
      product_code: 'WIRE-FRLS-2.5',
      category_id: cat2.id,
      manufacturer_id: mfg3.id,
      description: 'Flame retardant low smoke (FRLS) PVC insulated electrical wire, ISI marked',
      base_price: 38,
      mrp: 45,
      gst_rate: 18,
      hsn_code: '8544',
      min_order_qty: 100,
      lead_time_days: 2,
      stock_quantity: 10000,
      reorder_level: 1000,
      unit_of_measure: 'metres',
      quality_grade: 'A',
    });

    const prod5 = await Product.create({
      product_id: 'PRD-2025-0005',
      product_name: 'AAC Blocks 600x200x150mm',
      product_code: 'AAC-600-200',
      category_id: cat1.id,
      manufacturer_id: mfg1.id,
      description: 'Autoclaved Aerated Concrete blocks, lightweight, thermal insulating, fire resistant',
      base_price: 3800,
      mrp: 4200,
      gst_rate: 12,
      hsn_code: '6810',
      min_order_qty: 10,
      lead_time_days: 3,
      stock_quantity: 1000,
      reorder_level: 100,
      unit_of_measure: 'cubic metre',
      quality_grade: 'A',
    });

    console.log('✅ Products created');

    // ─── SUPPLIERS ──────────────────────────────────────────────────────────
    const sup1 = await Supplier.create({
      supplier_id: 'SUP-2025-0001',
      company_name: 'Gujarat B2B Supplies Pvt Ltd',
      contact_person: 'Vikram Singh',
      email: 'contact@gujb2b.com',
      phone: '+91-9000000001',
      address: '12 Trade Centre, Vastrapur',
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '24AABCU5055K1Z0',
      pan_number: 'AABCU5055K',
      supplier_type: 'primary',
      categories_supplied: [cat1.id, cat2.id],
      credit_limit: 2000000,
      credit_period_days: 45,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const sup2 = await Supplier.create({
      supplier_id: 'SUP-2025-0002',
      company_name: 'Maharashtra Material Traders',
      contact_person: 'Kavita Desai',
      email: 'info@mmtraders.com',
      phone: '+91-9000000006',
      address: '34 APMC Yard, Turbhe',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      gstin: '27AABCM5055K1Z0',
      pan_number: 'AABCM5055K',
      supplier_type: 'secondary',
      categories_supplied: [cat1.id, cat3.id],
      credit_limit: 1000000,
      credit_period_days: 30,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('✅ Suppliers created');

    // ─── WHOLESALERS ─────────────────────────────────────────────────────────
    const wsl1 = await Wholesaler.create({
      wholesaler_id: 'WSL-2025-0001',
      company_name: 'Metro Wholesale Pvt Ltd',
      contact_person: 'Arjun Patel',
      email: 'info@metrowholesale.com',
      phone: '+91-9000000002',
      address: '78 Wholesale Market, Sanand',
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '24AABCW5055K1Z0',
      pan_number: 'AABCW5055K',
      warehouse_locations: ['Sanand', 'Naroda', 'Bavla'],
      storage_capacity: 25000,
      product_categories: [cat1.id, cat2.id],
      suppliers_associated: [sup1.id],
      credit_limit: 5000000,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const wsl2 = await Wholesaler.create({
      wholesaler_id: 'WSL-2025-0002',
      company_name: 'Deccan Distributors LLP',
      contact_person: 'Ramesh Iyer',
      email: 'ramesh@deccandist.com',
      phone: '+91-9000000007',
      address: '56 Industrial Estate, Chakan',
      city: 'Pune',
      state: 'Maharashtra',
      gstin: '27AABCD5055K1Z0',
      pan_number: 'AABCD5055K',
      warehouse_locations: ['Chakan', 'Talegaon', 'Shirwal'],
      storage_capacity: 15000,
      product_categories: [cat1.id, cat3.id],
      suppliers_associated: [sup2.id],
      credit_limit: 3000000,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('✅ Wholesalers created');

    // ─── RETAILERS ──────────────────────────────────────────────────────────
    const rtl1 = await Retailer.create({
      retailer_id: 'RTL-2025-0001',
      company_name: 'Patel Hardware & Building Store',
      contact_person: 'Nitin Patel',
      email: 'nitin@patelhardware.com',
      phone: '+91-9000000003',
      address: '10 SG Highway, Bodakdev',
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '24AACCP5055K1Z0',
      store_type: 'physical',
      product_categories: [cat1.id, cat2.id],
      wholesalers_associated: [wsl1.id],
      customer_base_size: 800,
      monthly_volume_approx: 500000,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const rtl2 = await Retailer.create({
      retailer_id: 'RTL-2025-0002',
      company_name: 'BuildMart Online',
      contact_person: 'Sneha Joshi',
      email: 'ops@buildmart.in',
      phone: '+91-9000000008',
      address: '88 Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      gstin: '27AACCB5055K1Z0',
      store_type: 'both',
      product_categories: [cat1.id, cat2.id, cat3.id],
      wholesalers_associated: [wsl2.id],
      customer_base_size: 2000,
      monthly_volume_approx: 1200000,
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('✅ Retailers created');

    // ─── CLIENTS ─────────────────────────────────────────────────────────────
    const cli1 = await Client.create({
      client_id: 'CLT-2025-0001',
      client_type: 'company',
      company_name: 'Infra Build Contractors Pvt Ltd',
      contact_person: 'Deepak Verma',
      email: 'purchasing@infrabuild.com',
      phone: '+91-9000000004',
      address: 'Block A, Corporate Hub, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      gstin: '29AACCI5055K1Z0',
      pan_number: 'AACCI5055K',
      industry_sector: 'Construction',
      annual_purchase_value: 5000000,
      credit_limit: 1000000,
      credit_period_days: 60,
      assigned_retailer_id: rtl1.id,
      loyalty_tier: 'platinum',
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const cli2 = await Client.create({
      client_id: 'CLT-2025-0002',
      client_type: 'company',
      company_name: 'Shubham Realty Pvt Ltd',
      contact_person: 'Anand Shah',
      email: 'anand@shubhamrealty.com',
      phone: '+91-9000000009',
      address: '45 Navrangpura',
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '24AACCS5055K1Z0',
      pan_number: 'AACCS5055K',
      industry_sector: 'Real Estate',
      annual_purchase_value: 3000000,
      credit_limit: 750000,
      credit_period_days: 45,
      assigned_retailer_id: rtl1.id,
      loyalty_tier: 'gold',
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    const cli3 = await Client.create({
      client_id: 'CLT-2025-0003',
      client_type: 'individual',
      company_name: null,
      contact_person: 'Manjunath Reddy',
      email: 'manju.reddy@gmail.com',
      phone: '+91-9000000010',
      city: 'Hyderabad',
      state: 'Telangana',
      industry_sector: 'Independent Builder',
      annual_purchase_value: 500000,
      credit_limit: 200000,
      credit_period_days: 30,
      assigned_retailer_id: rtl2.id,
      loyalty_tier: 'silver',
      verified: true,
      verified_at: new Date(),
      status: 'active',
    });

    console.log('✅ Clients created');

    // ─── ORDERS ──────────────────────────────────────────────────────────────
    const order1 = await Order.create({
      order_id: 'ORD-2025-0001',
      order_type: 'purchase',
      status: 'delivered',
      buyer_type: 'Retailer',
      buyer_id: rtl1.id,
      seller_type: 'Wholesaler',
      seller_id: wsl1.id,
      order_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      expected_delivery_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      actual_delivery_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      delivery_address: { address: '10 SG Highway', city: 'Ahmedabad', state: 'Gujarat' },
      payment_status: 'paid',
      notes: 'Monthly cement restock order',
    });

    await OrderItem.create({
      order_id: order1.id,
      product_id: prod1.id,
      quantity: 500,
      unit_price: 350,
      discount_percent: 5,
      tax_percent: 28,
      tax_amount: 47050,
      line_total: 214550,
    });

    const order2 = await Order.create({
      order_id: 'ORD-2025-0002',
      order_type: 'sales',
      status: 'confirmed',
      buyer_type: 'Client',
      buyer_id: cli1.id,
      seller_type: 'Retailer',
      seller_id: rtl1.id,
      order_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expected_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      delivery_address: { address: 'Block A, Corporate Hub', city: 'Bangalore', state: 'Karnataka' },
      payment_status: 'partial',
      notes: 'Site requirement for Whitefield project',
    });

    await OrderItem.create({
      order_id: order2.id,
      product_id: prod2.id,
      quantity: 10,
      unit_price: 58000,
      discount_percent: 3,
      tax_percent: 18,
      tax_amount: 100980,
      line_total: 662980,
    });

    await OrderItem.create({
      order_id: order2.id,
      product_id: prod3.id,
      quantity: 5,
      unit_price: 1200,
      discount_percent: 0,
      tax_percent: 5,
      tax_amount: 300,
      line_total: 6300,
    });

    const order3 = await Order.create({
      order_id: 'ORD-2025-0003',
      order_type: 'purchase',
      status: 'processing',
      buyer_type: 'Wholesaler',
      buyer_id: wsl1.id,
      seller_type: 'Manufacturer',
      seller_id: mfg1.id,
      order_date: new Date(),
      expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      delivery_address: { address: 'Sanand Warehouse', city: 'Ahmedabad', state: 'Gujarat' },
      payment_status: 'pending',
      notes: 'Q1 bulk procurement from factory',
    });

    await OrderItem.create({
      order_id: order3.id,
      product_id: prod1.id,
      quantity: 2000,
      unit_price: 340,
      discount_percent: 8,
      tax_percent: 28,
      tax_amount: 174720,
      line_total: 800720,
    });

    console.log('✅ Orders created');

    // ─── SHIPMENTS ───────────────────────────────────────────────────────────
    await Shipment.create({
      shipment_id: 'SHP-2025-0001',
      order_id: order1.id,
      carrier_name: 'Express Logistics Gujarat',
      vehicle_number: 'GJ01AB1234',
      driver_name: 'Ravi Kumar',
      driver_phone: '+91-9000000005',
      tracking_number: 'ELGJ2025001',
      origin_address: 'Sanand Warehouse, Ahmedabad',
      destination_address: '10 SG Highway, Ahmedabad',
      dispatch_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      estimated_arrival: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      actual_arrival: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'delivered',
      weight_kg: 25000,
      volume_cbm: 20,
      freight_charges: 12000,
      tracking_events: [
        { status: 'picked_up', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), location: 'Sanand Warehouse', notes: 'Order picked up from warehouse' },
        { status: 'in_transit', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), location: 'Vatva Junction', notes: 'En route to delivery address' },
        { status: 'out_for_delivery', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Ahmedabad City', notes: 'Out for final delivery' },
        { status: 'delivered', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), location: 'SG Highway Store', notes: 'Delivered and accepted by Nitin Patel' },
      ],
    });

    await Shipment.create({
      shipment_id: 'SHP-2025-0002',
      order_id: order2.id,
      carrier_name: 'National Road Carriers',
      vehicle_number: 'MH04CD5678',
      driver_name: 'Mohan Patil',
      driver_phone: '+91-9000000011',
      tracking_number: 'NRC2025002',
      origin_address: '10 SG Highway, Ahmedabad',
      destination_address: 'Corporate Hub, Whitefield, Bangalore',
      dispatch_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimated_arrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'in_transit',
      weight_kg: 11000,
      volume_cbm: 15,
      freight_charges: 28000,
      tracking_events: [
        { status: 'picked_up', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'Patel Hardware, Ahmedabad', notes: 'Materials loaded and dispatched' },
        { status: 'in_transit', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), location: 'Surat Bypass, NH48', notes: 'Crossing Gujarat border, on schedule' },
      ],
    });

    console.log('✅ Shipments created');

    console.log('\n🎉 SHIVA SCM database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Ready to use. Open the app and log in with:');
    console.log('  Email   : admin@shivascm.com');
    console.log('  Password: ShivaSCM@2025');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    if (error.errors) error.errors.forEach(e => console.error('  →', e.message));
    process.exit(1);
  }
};

seed();
