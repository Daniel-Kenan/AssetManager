import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function GalleryComponent() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.map((item, index) => (
          <div key={index} className="relative group overflow-hidden rounded-lg">
            <img
              src={`/placeholder.svg?height=400&width=400`}
              alt={item.title}
              width={400}
              height={400}
              className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white text-center">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <Button variant="outline" size="lg" className="ml-4">
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}

const galleryItems = [
  { title: "Sunset Landscape", description: "Breathtaking view of the sunset." },
  { title: "Autumn Foliage", description: "Vibrant colors of the changing seasons." },
  { title: "City Skyline", description: "Towering skyscrapers against the sky." },
  { title: "Serene Lake", description: "Peaceful reflection on the water." },
  { title: "Misty Mountains", description: "Majestic peaks shrouded in fog." },
  { title: "Vibrant Flowers", description: "Colorful blooms in a garden." },
  { title: "Coastal Cliffs", description: "Rugged beauty of the seaside." },
  { title: "Starry Night Sky", description: "Breathtaking view of the cosmos." },
]