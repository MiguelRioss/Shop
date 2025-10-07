import {productsTags} from "../../websiteConfig.json"

export default function ProductTags({soldOut, few}){
    return(
        soldOut ? (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {productsTags.soldOut}
          </span>
        ) : few ? (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
            {productsTags.few}
          </span>
        ) : null
    )
}