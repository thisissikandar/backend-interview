import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const onboardingController = asyncHandler(async(req, res) => {
  try {
    const onboardingSteps = [
      {
        id: 1,
        title: "Find Your Perfect Student Home",
        description:
          "Browse through hundreds of verified student accommodations near your university. Filter by price, location, and amenities to find exactly what you're looking for.",
        imageUrl:
          "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 2,
        title: "Connect with Future Roommates",
        description:
          "Join our community of students and connect with like-minded individuals. Find compatible roommates through our smart matching system based on lifestyle and preferences.",
        imageUrl:
          "https://images.pexels.com/photos/1497997/pexels-photo-1497997.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 3,
        title: "Book and Move In Hassle-Free",
        description:
          "Secure your student housing with our easy booking process. Complete virtual tours, handle paperwork online, and move in with confidence knowing everything is verified.",
        imageUrl:
          "https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ];

    res.status(200).json(new ApiResponse(200,onboardingSteps,"Onboarding steps retrieved successfully")
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving onboarding steps",
    });
  }
})
export {onboardingController}