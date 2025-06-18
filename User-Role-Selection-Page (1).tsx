// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
const App: React.FC = () => {
const [activeTab, setActiveTab] = useState<string>("home");
const [searchQuery, setSearchQuery] = useState<string>("");
const [showAIOptions, setShowAIOptions] = useState<boolean>(false);
const [showSearchDestination, setShowSearchDestination] = useState<boolean>(false);
const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
const [showLocationStores, setShowLocationStores] = useState<boolean>(false);
const [showMatchScoreModal, setShowMatchScoreModal] = useState<boolean>(false);
const [showJobDetails, setShowJobDetails] = useState<boolean>(false);
const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);
const [showProfile, setShowProfile] = useState<boolean>(false);
const userProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  location: "Hyderabad, India",
  experience: "5+ years in retail",
  education: "Bachelor's in Business Administration",
  skills: ["Customer Service", "Team Management", "Sales", "Inventory Management"],
  languages: ["English", "Hindi"],
  availability: "Full-time",
  preferredLocation: "Hyderabad",
  avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20young%20professional%20with%20a%20confident%20smile%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=200&height=200&seq=32&orientation=squarish"
};
// Mock data for stores
const stores = [
{
id: 1,
name: "Weymans-Palo",
image: "https://readdy.ai/api/search-image?query=Grocery%20store%20front%20with%20colorful%20display%20window%20showing%20various%20food%20items%2C%20modern%20retail%20storefront%2C%20clean%20glass%20facade%2C%20bright%20lighting%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=1&orientation=landscape",
street: "Street No.7",
distance: "15$",
owner: {
name: "Alex",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20middle-aged%20store%20owner%20with%20a%20friendly%20smile%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=2&orientation=squarish"
}
},
{
id: 2,
name: "LST-Margo",
image: "https://readdy.ai/api/search-image?query=Small%20convenience%20store%20exterior%20with%20red%20signage%2C%20neighborhood%20shop%20front%2C%20urban%20retail%20space%2C%20street%20view%20of%20local%20business%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=3&orientation=landscape",
street: "Street No.8",
distance: "15$",
owner: {
name: "Sarah",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20female%20store%20manager%20with%20short%20hair%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=4&orientation=squarish"
}
},
{
id: 3,
name: "Original-shaine",
image: "https://readdy.ai/api/search-image?query=Clothing%20store%20front%20with%20mannequins%20in%20the%20display%20window%2C%20fashion%20retail%20storefront%2C%20modern%20glass%20facade%2C%20urban%20shopping%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=5&orientation=landscape",
street: "JUBILEE HILLS/HYDERABAD",
distance: "15$",
owner: {
name: "Mike",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20male%20entrepreneur%20with%20glasses%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=6&orientation=squarish"
}
},
{
id: 4,
name: "Google-Ram",
image: "https://readdy.ai/api/search-image?query=Colorful%20toy%20store%20front%20with%20playful%20window%20display%2C%20children%20retail%20shop%2C%20bright%20and%20inviting%20storefront%2C%20family-friendly%20business%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=7&orientation=landscape",
street: "S.R ROAD/HYDERABAD",
distance: "15$",
owner: {
name: "Priya",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20smiling%20female%20business%20owner%20with%20long%20hair%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=8&orientation=squarish"
}
}
];
// Hyderabad locations
const hyderabadLocations = [
{ id: 1, name: "Jubilee Hills", area: "Western Hyderabad", distance: "5 km" },
{ id: 2, name: "Banjara Hills", area: "Central Hyderabad", distance: "7 km" },
{ id: 3, name: "Hitech City", area: "IT Hub", distance: "12 km" },
{ id: 4, name: "Gachibowli", area: "Financial District", distance: "15 km" },
{ id: 5, name: "Secunderabad", area: "Twin City", distance: "10 km" },
{ id: 6, name: "Madhapur", area: "IT Corridor", distance: "11 km" },
{ id: 7, name: "Kukatpally", area: "Residential Area", distance: "18 km" },
{ id: 8, name: "Ameerpet", area: "Commercial Center", distance: "8 km" }
];
// Location stores data
const locationStores = [
{
id: 1,
name: "Raymond-Zainor",
image: "https://readdy.ai/api/search-image?query=Upscale%20clothing%20store%20front%20with%20elegant%20display%20window%2C%20fashion%20retail%20storefront%2C%20premium%20brand%20showcase%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=10&orientation=landscape",
rating: "20$",
owner: {
name: "Raymond",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20well-dressed%20male%20business%20owner%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20formal%20attire%2C%20centered%20composition&width=40&height=40&seq=11&orientation=squarish"
}
},
{
id: 2,
name: "Original-zainor",
image: "https://readdy.ai/api/search-image?query=Modern%20clothing%20boutique%20storefront%20with%20stylish%20window%20display%2C%20fashion%20retail%20space%2C%20urban%20shopping%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=12&orientation=landscape",
rating: "30$",
owner: {
name: "Original",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20fashion%20store%20owner%20with%20stylish%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20trendy%20attire%2C%20centered%20composition&width=40&height=40&seq=13&orientation=squarish"
}
},
{
id: 3,
name: "Diner-muffin",
image: "https://readdy.ai/api/search-image?query=Cozy%20cafe%20storefront%20with%20outdoor%20seating%2C%20coffee%20shop%20exterior%2C%20bakery%20display%20window%2C%20urban%20dining%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=14&orientation=landscape",
rating: "15$",
owner: {
name: "Diner",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20cafe%20owner%20with%20friendly%20smile%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20casual%20professional%20attire%2C%20centered%20composition&width=40&height=40&seq=15&orientation=squarish"
}
},
{
id: 4,
name: "Lotus-spice",
image: "https://readdy.ai/api/search-image?query=Indian%20restaurant%20storefront%20with%20decorative%20entrance%2C%20ethnic%20dining%20establishment%2C%20colorful%20signage%2C%20urban%20food%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=16&orientation=landscape",
rating: "11$",
owner: {
name: "Lotus",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20restaurant%20owner%20with%20confident%20expression%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=17&orientation=squarish"
}
},
{
id: 5,
name: "She's-regular",
image: "https://readdy.ai/api/search-image?query=Womens%20boutique%20storefront%20with%20elegant%20window%20display%2C%20fashion%20retail%20space%2C%20feminine%20design%20elements%2C%20urban%20shopping%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=18&orientation=landscape",
rating: "10$",
owner: {
name: "She's",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20female%20boutique%20owner%20with%20stylish%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20fashionable%20attire%2C%20centered%20composition&width=40&height=40&seq=19&orientation=squarish"
}
},
{
id: 6,
name: "Hasan-mary",
image: "https://readdy.ai/api/search-image?query=Jewelry%20store%20storefront%20with%20elegant%20display%20window%2C%20luxury%20retail%20space%2C%20premium%20product%20showcase%2C%20urban%20shopping%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=20&orientation=landscape",
rating: "25$",
owner: {
name: "Hasan",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20jewelry%20store%20owner%20with%20sophisticated%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20formal%20attire%2C%20centered%20composition&width=40&height=40&seq=21&orientation=squarish"
}
},
{
id: 7,
name: "Street Pitt-grill",
image: "https://readdy.ai/api/search-image?query=Barbecue%20restaurant%20storefront%20with%20outdoor%20grill%2C%20casual%20dining%20establishment%2C%20rustic%20design%20elements%2C%20urban%20food%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=22&orientation=landscape",
rating: "18$",
owner: {
name: "Street",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20grill%20restaurant%20owner%20with%20casual%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=23&orientation=squarish"
}
},
{
id: 8,
name: "Ben-Robert",
image: "https://readdy.ai/api/search-image?query=Mens%20clothing%20store%20storefront%20with%20professional%20display%20window%2C%20fashion%20retail%20space%2C%20business%20attire%20showcase%2C%20urban%20shopping%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=24&orientation=landscape",
rating: "25$",
owner: {
name: "Ben",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20mens%20clothing%20store%20owner%20with%20formal%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20attire%2C%20centered%20composition&width=40&height=40&seq=25&orientation=squarish"
}
},
{
id: 9,
name: "Google-India",
image: "https://readdy.ai/api/search-image?query=Modern%20tech%20store%20storefront%20with%20digital%20displays%2C%20electronics%20retail%20space%2C%20innovative%20product%20showcase%2C%20urban%20shopping%20location%2C%20professional%20store%20photography%2C%20isolated%20on%20simple%20background%2C%20centered%20composition&width=120&height=80&seq=26&orientation=landscape",
rating: "15$",
owner: {
name: "Google",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20tech%20store%20manager%20with%20modern%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=40&height=40&seq=27&orientation=squarish"
}
},
];
// AI features
const [showJobForm, setShowJobForm] = useState<boolean>(false);
const [showFormattedJobs, setShowFormattedJobs] = useState<boolean>(false);
const [isGeneratingJob, setIsGeneratingJob] = useState<boolean>(false);
const [jobFormData, setJobFormData] = useState({
storeName: "",
location: "",
position: "",
workHours: "",
wage: "",
responsibilities: "",
requirements: ""
});
const [jobListings, setJobListings] = useState([
{
storeName: "Weymans-Palo",
location: "Street No.7",
position: "Store Assistant",
workHours: "9 AM - 6 PM",
wage: "$15/hour",
responsibilities: "Customer service, inventory management",
requirements: "High school diploma, 1 year retail experience"
},
{
storeName: "LST-Margo",
location: "Street No.8",
position: "Cashier",
workHours: "10 AM - 7 PM",
wage: "$14/hour",
responsibilities: "Handle transactions, maintain cleanliness",
requirements: "Basic math skills, customer service experience"
}
]);
// Location-specific job listings
const [locationJobs, setLocationJobs] = useState([
{
id: 1,
storeName: "Raymond-Zainor",
position: "Sales Associate",
location: "Jubilee Hills",
wage: "$18/hour",
requirements: "Fashion retail experience, customer service skills",
matchScore: 85
},
{
id: 2,
storeName: "Original-zainor",
position: "Store Manager",
location: "Jubilee Hills",
wage: "$25/hour",
requirements: "3+ years retail management, fashion knowledge",
matchScore: 72
},
{
id: 3,
storeName: "Diner-muffin",
position: "Barista",
location: "Jubilee Hills",
wage: "$16/hour",
requirements: "Coffee preparation skills, customer service",
matchScore: 91
},
{
id: 4,
storeName: "Lotus-spice",
position: "Chef Assistant",
location: "Jubilee Hills",
wage: "$20/hour",
requirements: "Culinary experience, knowledge of Indian cuisine",
matchScore: 68
},
{
id: 5,
storeName: "She's-regular",
position: "Fashion Consultant",
location: "Jubilee Hills",
wage: "$17/hour",
requirements: "Fashion knowledge, sales experience, styling skills",
matchScore: 79
}
]);
// Candidate data for match score calculation
const [candidates, setCandidates] = useState([
{
id: 1,
name: "Priya Sharma",
skills: "Retail sales, customer service, inventory management",
experience: "2 years in fashion retail",
education: "Bachelor's in Business Administration",
availability: "Full-time, weekends",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20Indian%20woman%20with%20professional%20appearance%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=50&height=50&seq=28&orientation=squarish"
},
{
id: 2,
name: "Rahul Patel",
skills: "Food service, barista training, cash handling",
experience: "3 years in coffee shops",
education: "Associate's degree in Hospitality",
availability: "Part-time, evenings",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20Indian%20man%20with%20friendly%20smile%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20casual%20professional%20attire%2C%20centered%20composition&width=50&height=50&seq=29&orientation=squarish"
},
{
id: 3,
name: "Ananya Reddy",
skills: "Management, team leadership, scheduling",
experience: "5 years in retail management",
education: "MBA in Retail Management",
availability: "Full-time",
avatar: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20an%20Indian%20woman%20with%20confident%20expression%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20formal%20attire%2C%20centered%20composition&width=50&height=50&seq=30&orientation=squarish"
}
]);
const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
const [selectedJob, setSelectedJob] = useState<number | null>(null);
const aiFeatures = [
{
id: 1,
title: "Generate Job Description",
icon: "fa-file-alt",
description: "Create professional job listings with IBM Granite",
onClick: () => setShowJobForm(true)
},
{
id: 2,
title: "Format Job Posts",
icon: "fa-paragraph",
description: "View summarized job listings",
onClick: () => setShowFormattedJobs(true)
},
{
id: 3,
title: "Calculate Match Scores",
icon: "fa-percentage",
description: "Find the best candidates for your positions",
onClick: () => setShowMatchScoreModal(true)
},
{
id: 4,
title: "Generate Summaries",
icon: "fa-list-alt",
description: "Create concise summaries of applications"
}
];
// Function to generate job description with AI
const generateJobDescription = () => {
setIsGeneratingJob(true);
// Simulate AI generation with timeout
setTimeout(() => {
const generatedJob = {
storeName: jobFormData.storeName || "Your Store",
location: jobFormData.location || "Hyderabad",
position: jobFormData.position || "Retail Associate",
workHours: jobFormData.workHours || "9 AM - 6 PM",
wage: jobFormData.wage || "$15/hour",
responsibilities: jobFormData.responsibilities || "Customer service, inventory management, maintaining store cleanliness, assisting with merchandising, operating cash register, and providing product information to customers.",
requirements: jobFormData.requirements || "High school diploma or equivalent, 1+ year retail experience, excellent communication skills, ability to stand for extended periods, basic computer skills, and weekend availability."
};
setJobListings([...jobListings, generatedJob]);
setIsGeneratingJob(false);
setShowJobForm(false);
setJobFormData({
storeName: "",
location: "",
position: "",
workHours: "",
wage: "",
responsibilities: "",
requirements: ""
});
}, 2000);
};
// Function to handle location selection
const handleLocationSelect = (locationName: string) => {
setSelectedLocation(locationName);
setShowSearchDestination(false);
setShowLocationStores(true);
};
// Function to calculate match score
const calculateMatchScore = () => {
if (selectedCandidate !== null && selectedJob !== null) {
// In a real app, this would use AI to calculate the match
// Here we're just returning the pre-defined score
return locationJobs.find(job => job.id === selectedJob)?.matchScore || 0;
}
return 0;
};
return (
<div className="relative bg-white min-h-screen w-[375px] mx-auto flex flex-col">
{/* Header */}
<div className="fixed w-[375px] top-0 bg-white z-10 shadow-sm">
<div className="flex items-center justify-between h-12 px-3">
<button className="text-gray-700 cursor-pointer">
<i className="fas fa-bars text-xl"></i>
</button>
<div className="bg-gray-900 px-4 py-2 rounded-full">
<span className="text-white font-semibold">FL JOBS</span>
</div>
<Avatar className="h-9 w-9 cursor-pointer" onClick={() => setShowProfile(true)}>
<AvatarImage src="https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20young%20professional%20with%20a%20confident%20smile%2C%20high%20quality%20portrait%2C%20neutral%20background%2C%20well-lit%20face%2C%20business%20casual%20attire%2C%20centered%20composition&width=36&height=36&seq=9&orientation=squarish" alt="User" />
<AvatarFallback>JD</AvatarFallback>
</Avatar>
</div>
</div>
{/* Main Content */}
<div className="w-full mt-14 mb-16 flex flex-col">
{showLocationStores ? (
<>
{/* Location Stores View */}
<div className="flex items-center px-4 py-3 border-b">
<button
className="mr-2 text-gray-800 cursor-pointer"
onClick={() => setShowLocationStores(false)}
>
<i className="fas fa-arrow-left"></i>
</button>
<span className="font-semibold text-gray-900">{selectedLocation}</span>
</div>
<ScrollArea className="flex-1">
<div className="grid grid-cols-2 gap-3 p-3">
{locationStores.map((store) => (
<Card key={store.id} className="overflow-hidden cursor-pointer !rounded-button border border-gray-200 hover:border-blue-300 transition-all duration-200">
<div className="h-20 overflow-hidden">
<img
src={store.image}
alt={store.name}
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-2">
<div className="flex items-center mb-1">
<Avatar className="h-6 w-6 mr-1">
<AvatarImage src={store.owner.avatar} alt={store.owner.name} />
<AvatarFallback>{store.owner.name.charAt(0)}</AvatarFallback>
</Avatar>
<div className="flex-1">
<p className="text-xs font-medium text-gray-900 truncate">{store.name}</p>
</div>
</div>
<div className="flex items-center justify-between">
<p className="text-xs text-gray-500 truncate">{selectedLocation}</p>
<Badge variant="outline" className="text-xs font-normal">{store.rating}</Badge>
</div>
</div>
</Card>
))}
</div>
{/* Job Listings for this location */}
<div className="px-4 py-3 border-t">
<h3 className="font-semibold text-gray-900 mb-3">JOB LISTINGS IN {selectedLocation}</h3>
<div className="space-y-3">
{locationJobs.map((job) => (
<Card
key={job.id}
className="p-3 cursor-pointer !rounded-button hover:bg-blue-50 transition-all duration-200"
onClick={() => {
setSelectedJobDetails(job);
setShowJobDetails(true);
}}
>
<div className="flex justify-between items-start">
<div>
<h3 className="font-medium text-gray-900">{job.position}</h3>
<p className="text-sm text-gray-700">{job.storeName}</p>
<p className="text-xs text-gray-500 mt-1">{job.requirements}</p>
</div>
<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{job.wage}</Badge>
</div>
<div className="mt-2 flex items-center">
<span className="text-xs text-gray-500 mr-2">Match Score:</span>
<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
<div
className={`h-full rounded-full ${
job.matchScore > 80 ? 'bg-green-500' :
job.matchScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
}`}
style={{ width: `${job.matchScore}%` }}
></div>
</div>
<span className="text-xs font-medium ml-2">{job.matchScore}%</span>
</div>
</Card>
))}
</div>
</div>
</ScrollArea>
</>
) : (
<>
{/* Default Home View */}
<div className="flex items-center px-4 py-3 border-b">
<i className="fas fa-map-marker-alt text-gray-800 mr-2"></i>
<span className="font-semibold text-gray-900">STORES NEAR YOU</span>
</div>
{/* Store Listings */}
<ScrollArea className="flex-1">
<div className="grid grid-cols-2 gap-2 p-2">
{stores.map((store) => (
<Card 
key={store.id} 
className="overflow-hidden cursor-pointer !rounded-button border border-gray-200 hover:border-blue-300 transition-all duration-200"
onClick={() => {
  setSelectedJobDetails({
    storeName: store.name,
    location: store.street,
    position: "Store Associate",
    wage: store.distance,
    requirements: "Experience in retail, customer service skills",
    matchScore: 85
  });
  setShowJobDetails(true);
}}
>
<div className="h-[100px] overflow-hidden">
<img
src={store.image}
alt={store.name}
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-2">
<div className="flex items-center mb-1">
<Avatar className="h-6 w-6 mr-1">
<AvatarImage src={store.owner.avatar} alt={store.owner.name} />
<AvatarFallback>{store.owner.name.charAt(0)}</AvatarFallback>
</Avatar>
<div className="flex-1">
<p className="text-xs font-medium text-gray-900 truncate">{store.name}</p>
</div>
</div>
<div className="flex items-center justify-between">
<p className="text-xs text-gray-500 truncate">{store.street}</p>
<Badge variant="outline" className="text-xs font-normal">{store.distance}</Badge>
</div>
</div>
</Card>
))}
</div>
{/* Search Destination */}
<div className="px-4 py-3 border-t">
<div
className="flex items-center bg-gray-100 rounded-full px-4 py-2 cursor-pointer"
onClick={() => setShowSearchDestination(true)}
>
<i className="fas fa-search text-gray-500 mr-2"></i>
<span className="text-gray-700">SEARCH DESTINATION</span>
</div>
</div>
{/* Recent Visit */}
<div className="px-4 py-3 border-t flex items-center cursor-pointer">
<i className="fas fa-history text-gray-700 mr-3"></i>
<span className="text-gray-900 font-medium">RECENT VISIT</span>
</div>
{/* IBM Granite AI Features */}
<div className="px-4 py-3 border-t">
<div
className="flex items-center justify-between cursor-pointer"
onClick={() => setShowAIOptions(!showAIOptions)}
>
<div className="flex items-center">
<i className="fas fa-robot text-blue-600 mr-3"></i>
<span className="text-gray-900 font-medium">IBM GRANITE AI</span>
</div>
<i className={`fas fa-chevron-${showAIOptions ? 'up' : 'down'} text-gray-500`}></i>
</div>
{showAIOptions && (
<div className="mt-3 space-y-3">
{aiFeatures.map((feature) => (
<Card
key={feature.id}
className="p-3 cursor-pointer !rounded-button hover:bg-blue-50 transition-all duration-200"
onClick={feature.onClick}
>
<div className="flex items-center">
<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
<i className={`fas ${feature.icon} text-blue-600`}></i>
</div>
<div>
<h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
<p className="text-xs text-gray-500">{feature.description}</p>
</div>
</div>
</Card>
))}
</div>
)}
</div>
{/* Job Listings Section */}
{jobListings.length > 0 && (
<div className="px-4 py-3 border-t">
<h3 className="font-semibold text-gray-900 mb-3">YOUR JOB LISTINGS</h3>
<div className="space-y-3">
{jobListings.map((job, index) => (
<Card key={index} className="p-3 !rounded-button">
<div className="flex justify-between items-start">
<div>
<h3 className="font-medium text-gray-900">{job.position}</h3>
<p className="text-sm text-gray-700">{job.storeName} • {job.location}</p>
<p className="text-xs text-gray-500 mt-1">{job.workHours}</p>
</div>
<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{job.wage}</Badge>
</div>
</Card>
))}
</div>
</div>
)}
</ScrollArea>
</>
)}
</div>
{/* Tab Bar */}
<div className="fixed bottom-0 w-[375px] bg-gray-100 border-t border-gray-200 z-10">
<div className="grid grid-cols-3 h-14">
<button
className={`flex flex-col items-center justify-center cursor-pointer ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-600'}`}
onClick={() => setActiveTab('notifications')}
>
<i className="fas fa-bell text-lg"></i>
<span className="text-xs mt-1">NOTIFICATIONS</span>
</button>
<button
className={`flex flex-col items-center justify-center cursor-pointer ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
onClick={() => setActiveTab('home')}
>
<i className="fas fa-home text-lg"></i>
<span className="text-xs mt-1">HOME</span>
</button>
<button
className={`flex flex-col items-center justify-center cursor-pointer ${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-600'}`}
onClick={() => {
setActiveTab('upload');
setShowJobForm(true);
}}
>
<i className="fas fa-upload text-lg"></i>
<span className="text-xs mt-1">UPLOAD</span>
</button>
</div>
</div>
{/* Search Destination Modal */}
<Dialog open={showSearchDestination} onOpenChange={setShowSearchDestination}>
<DialogContent className="w-[355px] mx-auto">
<DialogHeader>
<DialogTitle>Locations in Hyderabad, India</DialogTitle>
</DialogHeader>
<div className="mb-4">
<div className="relative">
<Input
type="text"
placeholder="Search locations in Hyderabad"
className="pr-10"
/>
<div className="absolute inset-y-0 right-0 flex items-center pr-3">
<i className="fas fa-search text-gray-400"></i>
</div>
</div>
</div>
<div className="space-y-2 max-h-[70vh] overflow-y-auto">
{hyderabadLocations.map(location => (
<Card
key={location.id}
className="p-2.5 cursor-pointer !rounded-button hover:bg-blue-50"
onClick={() => handleLocationSelect(location.name)}
>
<div className="flex justify-between items-center">
<div>
<h3 className="font-medium text-gray-900">{location.name}</h3>
<p className="text-sm text-gray-500">{location.area}</p>
</div>
<Badge variant="outline">{location.distance}</Badge>
</div>
</Card>
))}
</div>
</DialogContent>
</Dialog>
{/* Job Form Modal */}
<Dialog open={showJobForm} onOpenChange={setShowJobForm}>
<DialogContent className="w-[355px] mx-auto">
<DialogHeader>
<DialogTitle>Create Job Listing</DialogTitle>
</DialogHeader>
<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
<Input
type="text"
value={jobFormData.storeName}
onChange={(e) => setJobFormData({...jobFormData, storeName: e.target.value})}
className="w-full"
placeholder="Enter store name"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
<Input
type="text"
value={jobFormData.location}
onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
className="w-full"
placeholder="Enter location"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
<Input
type="text"
value={jobFormData.position}
onChange={(e) => setJobFormData({...jobFormData, position: e.target.value})}
className="w-full"
placeholder="Enter position title"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Work Hours</label>
<Input
type="text"
value={jobFormData.workHours}
onChange={(e) => setJobFormData({...jobFormData, workHours: e.target.value})}
className="w-full"
placeholder="e.g., 9 AM - 5 PM"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Wage</label>
<Input
type="text"
value={jobFormData.wage}
onChange={(e) => setJobFormData({...jobFormData, wage: e.target.value})}
className="w-full"
placeholder="e.g., $15/hour"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
<Input
type="text"
value={jobFormData.responsibilities}
onChange={(e) => setJobFormData({...jobFormData, responsibilities: e.target.value})}
className="w-full"
placeholder="Enter job responsibilities"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
<Input
type="text"
value={jobFormData.requirements}
onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})}
className="w-full"
placeholder="Enter job requirements"
/>
</div>
<div className="flex space-x-2">
<Button
className="flex-1"
variant="outline"
onClick={() => setShowJobForm(false)}
>
Cancel
</Button>
<Button
className="flex-1"
onClick={generateJobDescription}
disabled={isGeneratingJob}
>
{isGeneratingJob ? (
<>
<i className="fas fa-spinner fa-spin mr-2"></i>
Generating...
</>
) : "Generate with AI"}
</Button>
</div>
</div>
</DialogContent>
</Dialog>
{/* Formatted Jobs Modal */}
<Dialog open={showFormattedJobs} onOpenChange={setShowFormattedJobs}>
<DialogContent className="w-[355px] mx-auto">
<DialogHeader>
<DialogTitle>Formatted Job Listings</DialogTitle>
</DialogHeader>
<div className="space-y-4 max-h-[400px] overflow-y-auto">
{jobListings.map((job, index) => (
<Card key={index} className="p-4 !rounded-button">
<div className="space-y-2">
<div className="flex justify-between items-center">
<h3 className="font-medium text-gray-900">{job.position}</h3>
<Badge variant="outline">{job.wage}</Badge>
</div>
<p className="text-sm text-gray-700">{job.storeName} • {job.location}</p>
<p className="text-sm text-gray-700"><span className="font-medium">Hours:</span> {job.workHours}</p>
<div>
<p className="text-sm font-medium text-gray-700">Responsibilities:</p>
<p className="text-sm text-gray-600">{job.responsibilities}</p>
</div>
<div>
<p className="text-sm font-medium text-gray-700">Requirements:</p>
<p className="text-sm text-gray-600">{job.requirements}</p>
</div>
<div className="flex justify-end">
<Button variant="outline" size="sm" className="text-xs">
<i className="fas fa-share-alt mr-1"></i> Share
</Button>
</div>
</div>
</Card>
))}
</div>
</DialogContent>
</Dialog>
{/* Match Score Modal */}
<Dialog open={showMatchScoreModal} onOpenChange={setShowMatchScoreModal}>
<DialogContent className="w-[355px] mx-auto">
<DialogHeader>
<DialogTitle>Calculate Match Scores</DialogTitle>
</DialogHeader>
<div className="space-y-4">
<div>
<h3 className="text-sm font-medium text-gray-700 mb-2">Select Job Position</h3>
<div className="space-y-2 max-h-[150px] overflow-y-auto">
{locationJobs.map((job) => (
<Card
key={job.id}
className={`p-2 cursor-pointer !rounded-button ${selectedJob === job.id ? 'border-blue-500 bg-blue-50' : ''}`}
onClick={() => setSelectedJob(job.id)}
>
<div className="flex justify-between items-center">
<div>
<p className="font-medium text-gray-900">{job.position}</p>
<p className="text-xs text-gray-500">{job.storeName}</p>
</div>
<Badge variant="outline">{job.wage}</Badge>
</div>
</Card>
))}
</div>
</div>
<div>
<h3 className="text-sm font-medium text-gray-700 mb-2">Select Candidate</h3>
<div className="space-y-2 max-h-[200px] overflow-y-auto">
{candidates.map((candidate) => (
<Card
key={candidate.id}
className={`p-3 cursor-pointer !rounded-button ${selectedCandidate === candidate.id ? 'border-blue-500 bg-blue-50' : ''}`}
onClick={() => setSelectedCandidate(candidate.id)}
>
<div className="flex items-start">
<Avatar className="h-10 w-10 mr-3">
<AvatarImage src={candidate.avatar} alt={candidate.name} />
<AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
</Avatar>
<div>
<p className="font-medium text-gray-900">{candidate.name}</p>
<p className="text-xs text-gray-600 mt-1">{candidate.skills}</p>
<p className="text-xs text-gray-500">{candidate.experience}</p>
</div>
</div>
</Card>
))}
</div>
</div>
{selectedJob !== null && selectedCandidate !== null && (
<div className="mt-4">
<h3 className="text-sm font-medium text-gray-700 mb-2">Match Score</h3>
<div className="bg-gray-100 p-4 rounded-lg">
<div className="flex items-center justify-between mb-2">
<span className="text-gray-700">Compatibility</span>
<span className="font-medium">{calculateMatchScore()}%</span>
</div>
<Progress value={calculateMatchScore()} className="h-2" />
<div className="mt-3 text-center">
<Badge className={`${
calculateMatchScore() > 80 ? 'bg-green-100 text-green-800' :
calculateMatchScore() > 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
}`}>
{calculateMatchScore() > 80 ? 'Excellent Match' :
calculateMatchScore() > 70 ? 'Good Match' : 'Fair Match'}
</Badge>
</div>
</div>
<div className="mt-3">
<p className="text-xs text-gray-500">
This score is calculated based on the candidate's skills, experience, and qualifications compared to the job requirements.
</p>
</div>
</div>
)}
<div className="flex justify-end">
<Button onClick={() => setShowMatchScoreModal(false)}>
Close
</Button>
</div>
</div>
</DialogContent>
</Dialog>
{/* Profile Page */}
{showProfile && (
  <div className="fixed inset-0 bg-white z-50 w-[375px] mx-auto">
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b">
        <button
          className="text-gray-800 cursor-pointer"
          onClick={() => setShowProfile(false)}
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <span className="ml-4 font-semibold text-gray-900">Profile</span>
      </div>
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
            <p className="text-gray-600">{userProfile.location}</p>
          </div>

          <div className="space-y-6">
            <Card className="p-4 !rounded-button">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <i className="fas fa-envelope text-gray-400 w-6"></i>
                  <span className="text-gray-700 ml-2">{userProfile.email}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone text-gray-400 w-6"></i>
                  <span className="text-gray-700 ml-2">{userProfile.phone}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 !rounded-button">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Professional Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-gray-700">{userProfile.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="text-gray-700">{userProfile.education}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Languages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userProfile.languages.map((language, index) => (
                      <Badge key={index} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 !rounded-button">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Job Preferences</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="text-gray-700">{userProfile.availability}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Location</p>
                  <p className="text-gray-700">{userProfile.preferredLocation}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ScrollArea>
      
      {/* Bottom Action */}
      <div className="p-4 border-t">
        <Button className="w-full !rounded-button" size="lg">
          EDIT PROFILE
        </Button>
      </div>
    </div>
  </div>
)}

{/* Job Details Page */}
{showJobDetails && selectedJobDetails && (
<div className="fixed inset-0 bg-white z-50 w-[375px] mx-auto">
<div className="flex flex-col h-full">
{/* Header */}
<div className="flex items-center px-4 py-3 border-b">
<button
className="text-gray-800 cursor-pointer"
onClick={() => setShowJobDetails(false)}
>
<i className="fas fa-arrow-left text-xl"></i>
</button>
<span className="ml-4 font-semibold text-gray-900">Job Details</span>
</div>
{/* Content */}
<div className="flex-1 overflow-y-auto">
<div className="p-4">
{/* Store Image */}
<div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
<img
src="https://readdy.ai/api/search-image?query=Modern%20retail%20store%20interior%20with%20clothing%20racks%20and%20displays%2C%20fashion%20boutique%20with%20elegant%20design%2C%20professional%20retail%20photography%2C%20bright%20lighting%2C%20minimalist%20aesthetic%2C%20centered%20composition&width=375&height=192&seq=31&orientation=landscape"
alt="Store"
className="w-full h-full object-cover"
/>
</div>
{/* Store Info */}
<div className="mb-6">
<div className="flex items-center justify-between">
<h2 className="text-xl font-semibold text-gray-900">{selectedJobDetails.storeName}</h2>
<Badge className="bg-blue-100 text-blue-800">{selectedJobDetails.wage}</Badge>
</div>
<p className="text-gray-600 mt-1">{selectedJobDetails.location}</p>
</div>
{/* Position Details */}
<div className="space-y-4">
<div>
<h3 className="text-lg font-medium text-gray-900">Position</h3>
<p className="text-gray-700 mt-1">{selectedJobDetails.position}</p>
</div>
<div>
<h3 className="text-lg font-medium text-gray-900">Requirements</h3>
<p className="text-gray-700 mt-1">{selectedJobDetails.requirements}</p>
</div>
<div>
<h3 className="text-lg font-medium text-gray-900">Match Score</h3>
<div className="mt-2 bg-gray-100 p-4 rounded-lg">
<div className="flex items-center justify-between mb-2">
<span className="text-gray-700">Compatibility</span>
<span className="font-medium">{selectedJobDetails.matchScore}%</span>
</div>
<Progress value={selectedJobDetails.matchScore} className="h-2" />
<div className="mt-3 text-center">
<Badge className={`${
selectedJobDetails.matchScore > 80 ? 'bg-green-100 text-green-800' :
selectedJobDetails.matchScore > 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
}`}>
{selectedJobDetails.matchScore > 80 ? 'Excellent Match' :
selectedJobDetails.matchScore > 70 ? 'Good Match' : 'Fair Match'}
</Badge>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Bottom Action */}
<div className="p-4 border-t">
<Button className="w-full !rounded-button" size="lg">
CONNECT
</Button>
</div>
</div>
</div>
)}
</div>
);
};
export default App