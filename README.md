# MOE Frontend

A modern, minimalist React frontend for MOE (Millwork Oriented Expert / Millwork Optimized Estimating) - an intelligent assistant platform for the millwork industry.

## Features

### Core Functionality
- **Minimalist Homepage**: Clean, Google/ChatGPT-style interface with centered input
- **Chat Interface**: Real-time conversation with MOE for millwork questions
- **File Upload**: Support for .cab, .cabx, .mzb, and .xml files (Pro plans only)
- **Pricing Plans**: Clear tier structure with upgrade prompts

### User Experience
- **Free Tier**: 5 queries/day with gpt-4o-mini model
- **Paid Tiers**: Enhanced features with gpt-4o model
- **Upgrade Prompts**: Strategic prompts encouraging Pro plan upgrades
- **Responsive Design**: Works on desktop, tablet, and mobile

### Technical Features
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Component Architecture**: Modular, reusable components
- **State Management**: Simple React state for demo purposes

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.js     # Main chat functionality
│   ├── FileUpload.js        # File upload with upgrade prompts
│   └── PricingPlans.js      # Pricing tiers display
├── App.js                   # Main application component
├── index.css               # Tailwind CSS imports
└── index.js                # React entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moe-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Navigation
- **Home**: Main landing page with search input
- **Chat**: Interactive chat interface with MOE
- **File Upload**: Upload millwork files for analysis
- **Plans & Pricing**: View available subscription tiers

### Demo Features
- **Free User Experience**: Limited queries with upgrade prompts
- **Pro User Experience**: Full features with detailed responses
- **File Analysis**: Simulated file processing for paid plans
- **Responsive Design**: Test on different screen sizes

## Design Philosophy

### Minimalist Approach
- Clean, distraction-free interface
- Focus on utility and functionality
- Professional appearance for millwork industry
- Scalable design for future features

### User Experience
- Clear value proposition
- Strategic upgrade prompts
- Intuitive navigation
- Fast, responsive interactions

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (via SVG)
- **Fonts**: Inter (Google Fonts)
- **Build Tool**: Create React App

## Future Enhancements

- **Authentication**: User login/signup system
- **Backend Integration**: Real API endpoints
- **File Processing**: Actual file analysis
- **Payment Processing**: Stripe integration
- **Analytics**: Usage tracking and insights
- **Mobile App**: React Native version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for MOE platform.

## Support

For questions or support, please contact the development team.
