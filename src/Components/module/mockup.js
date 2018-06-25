import Image_1 from '../../images/banner.png'
import Image_2 from '../../images/banner1.png'
import Image_3 from '../../images/banner2.png'
import Image_4 from '../../images/banner3.png'

const Image_Array = [Image_1, Image_2, Image_3, Image_4]

const mockUp = []

for (let index = 0; index < 10; index++) {
    const randomNumber = Math.floor(Math.random() * 4)
    mockUp[index] = {
        key: index.toString(),
        BranchId: index + 1,
        PromotionId: index + 1,
        image: Image_Array[randomNumber],
        BranchName: 'A Restaurant',
        PromotionName: `Discount ${randomNumber + 1}0%`,
        Description: `Everything Discount ${randomNumber + 1}0%`,
        distance: `${index + 1}00 m`,
        EndDate: '30 เมษายน 2561'
    }
}

export default mockUp