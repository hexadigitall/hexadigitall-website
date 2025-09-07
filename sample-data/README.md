# Sample Service Categories Data

This directory contains sample service data for testing the comprehensive service request system.

## 📋 What's Included

The sample data includes **6 professional IT service categories** with Nigerian market pricing:

### 🌟 Featured Services
1. **Web Development** - From basic websites to enterprise platforms (₦800,000 - ₦4,500,000)
2. **Network Setup & Security** - Professional network infrastructure (₦600,000 - ₦1,800,000)

### 💼 Additional Services
3. **Mobile App Development** - iOS/Android apps (₦2,500,000 - ₦6,000,000)
4. **IT Support & System Administration** - Hourly to managed services (₦25,000/hr - ₦1,200,000/mo)
5. **Data Analytics & Business Intelligence** - Data insights and dashboards (₦1,000,000 - ₦3,000,000)

## 🎯 Features Included

Each service category includes:
- **Tiered Packages**: Basic, Standard, Premium, Enterprise
- **Detailed Features**: Comprehensive feature lists for each tier
- **Add-on Services**: Optional extras with separate pricing
- **Professional Pricing**: Realistic market-based pricing
- **Delivery Timelines**: Clear expectations for each service
- **Requirements**: What clients need to provide
- **FAQ Sections**: Common questions and answers
- **Popular Package Indicators**: "Most Popular" badges

## 📁 File Structure

- `service-categories-ngn.json` - Complete sample data in Nigerian Naira (NGN)
- `service-categories.json` - Original USD sample data (for reference)
- `README.md` - This instruction file

## 🚀 How to Add Sample Data

### Option 1: Manual Import via Sanity Studio (Recommended)

1. **Access Sanity Studio**
   ```bash
   npm run dev
   # Visit http://localhost:3000/studio
   ```

2. **Create Service Categories**
   - Click "Service Category" in the left panel
   - Click "Create" button
   - Copy the data from `service-categories-ngn.json` 
   - Create each service category manually using the provided data

3. **Important Fields to Set:**
   - Title, Description, Icon name
   - Slug (auto-generated from title)
   - Featured status (true for Web Development and Network Setup)
   - Order (1-7 as provided)
   - All packages with their tiers, pricing, and features
   - Requirements and FAQ sections

### Option 2: Programmatic Import (Requires Write Token)

1. **Get a Sanity Write Token**
   - Go to [Sanity Manage](https://www.sanity.io/manage)
   - Select your project
   - Go to API > Tokens
   - Create a new token with "Write" permissions

2. **Add Token to Environment**
   ```bash
   # Add to .env.local
   SANITY_API_WRITE_TOKEN="your_write_token_here"
   ```

3. **Update Script and Run**
   ```bash
   # Edit scripts/create-sample-services.js
   # Change SANITY_API_READ_TOKEN to SANITY_API_WRITE_TOKEN
   npm run create-sample-services
   ```

## ✅ Testing the System

After adding the sample data:

1. **Visit Services Page**
   ```
   http://localhost:3000/services
   ```

2. **Test Service Request Flow**
   - Click "Request Service" on any service card
   - Go through the 3-step process:
     - Package selection with add-ons
     - Project details and client info
     - Payment summary and Stripe checkout

3. **Test Different Service Types**
   - One-time payments (Web Development, Mobile Apps)
   - Hourly billing (IT Support)
   - Monthly billing (Managed IT Services)

## 🎨 Customization

You can customize the sample data by:

1. **Adjusting Prices**: Modify pricing to match your market
2. **Adding Services**: Create additional service categories
3. **Modifying Features**: Update feature lists for each tier
4. **Currency Consistency**: All pricing is now in Nigerian Naira (NGN)
5. **Delivery Times**: Adjust timelines to match your capacity

## 🔧 Service Icons Available

The system includes these predefined icons:
- `code` - Web development
- `mobile` - Mobile apps  
- `server` - Cloud/DevOps
- `settings` - IT support
- `network` - Networking
- `chart` - Analytics
- `monitor` - General IT services

## 💡 Pro Tips

1. **Start Small**: Begin with 2-3 service categories and expand
2. **Real Pricing**: Use actual market rates for your region
3. **Featured Services**: Mark your most popular services as featured
4. **Add-ons Strategy**: Use add-ons to increase average order value
5. **Clear Descriptions**: Write compelling, clear service descriptions
6. **FAQ Content**: Address real customer concerns in FAQ sections

## 🚀 Production Considerations

When deploying to production:

1. **Update Pricing**: Ensure all prices reflect your actual rates
2. **Payment Integration**: Test Stripe integration thoroughly
3. **Legal Pages**: Update Terms of Service and Privacy Policy
4. **Contact Information**: Update email addresses and contact info
5. **Webhooks**: Set up Stripe webhooks for payment confirmation

## 📞 Support

The service request system includes:
- Automatic email notifications
- Payment confirmation workflows
- Project status tracking
- Client communication tools

## 🇳🇬 Nigerian Market Considerations

The pricing has been adjusted for the Nigerian market:

### 💰 **Pricing Strategy**
- **Basic Website**: ₦800,000 - Competitive for small businesses
- **Business Website**: ₦1,800,000 - Professional tier for growing companies  
- **Enterprise Platform**: ₦4,500,000 - Premium for large organizations
- **IT Support**: ₦25,000/hour - Reasonable for technical support
- **Managed Services**: ₦1,200,000/month - Comprehensive IT management
- **Mobile Apps**: ₦2,500,000+ - Reflects development complexity
- **Network Setup**: ₦600,000+ - Professional infrastructure solutions

### 🏦 **Payment Integration**
- Stripe supports NGN transactions
- Consider adding Paystack for local payment preferences
- Bank transfer options for larger contracts
- Installment payment plans for premium services

### 🗺️ **Local Adaptations**
- Business hours support uses WAT (West Africa Time)
- Lagos area mentioned for on-site visits
- Pricing considers local market conditions
- Service descriptions avoid region-specific references

Your professional IT service request system is ready to handle real Nigerian client inquiries and payments! 🇳🇬🎉
