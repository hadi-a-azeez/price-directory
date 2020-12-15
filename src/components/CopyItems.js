export const resellerCopy = (product, sizeArr) => {
  return `📢Daily stock update

👉Product code: ${product.product_cod}
👉Price: ₹${parseInt(
    product.product_price - (product.product_price / 100) * 10
  )}
👉Fabric: ${product.fabric}
👉Size:${sizeArr.toString()}
🚚Shipping:3-7 Days 

📩Message us for all your enquiries and orders`;
};

let hashtags = [
  "#westerndress #fashion #fashionista #fashionable #dress #gown #ootd #salwarsuit #instafashion #dresses #tops #western #kundanjewellery #trendy #usa #dungrees #kurta #wedding #fashionphotography #kurti #salwar #afghanijewelchik # #daily #designstudio #elegant #festivewear",
  "#kerala #godsowncountry #mallu #malayali #mallugram #malayalam #kochi #keralam #malluproud #southindia #malayalee #mallus #cochin #kozhikode #mollywood #trivandrum #keralaattraction #malayalamcinema #keralatourism #wayanad #thrissur #southindian #indiancinema #munnar #alappuzha #india_91 #kollywood #clickindiaclick #chennai #kolkata",
  "#calicut #kerala #wayanad #kozhikode #kochi #malappuram #idukki #kollam #alappuzha #kannur #trivandrum #ernakulam #godsowncountry #love #mallugram #keralatourism #kozhikoden #india #kerala360 #keralagodsowncountry #instagood #entekeralam #keralaattraction #instagram #palakkad #kottayam #malayalamquotes #thrissur #photography #malluhood",
  "#stylish #outfitoftheday #shoes #lookbook #instastyle #menswear #fashiongram #fashionable #fashionblog #look #streetwear #fashiondiaries #lookoftheday #fashionstyle #streetfashion #jewelry #clothes #fashionpost #styleblogger #menstyle #trend #accessories #fashionaddict #wiw #wiwt #designer #trendy #blog #hairstyle #whatiwore",
  "#fashionindia #fashion #style #fashionphotography #indianfashion #portrait #portraitphotography #mensfashion #indianphotography #glamour #menshair #fashionphotographer #clothes #instagram #fashions #fashionph #indianmen #clothingbrand #men #indianfashionphotographer #portraitsofficial #glamourous #portrait_ig #india #portrait_shots #fashionblogger #instagood #fashionista #model #fambruh",
  "#kurti #fashion #saree #ethnicwear #style #onlineshopping #indianwear #kurtis #ethnic #designer #india #fashionblogger #indianwedding #instafashion #indian #love #indianfashion #dresses #dress #kurtilover #lehenga #sarees #salwarkameez #bhfyp #ootd #designerkurti #delhi #shopping #instagram #wedding",
];
let cta = [
  "Loved it? SAVE for later!",
  "Share With Friends Who would love it!",
  "Limited Stocks Available! Get yours now",
  "Order & Get Within 7 Days",
];
export const instagramCopy = (product) => {
  return `DM for order & queries

Product Code: ${product.product_cod}
Price: ${product.product_price}/ -

${cta[Math.floor(Math.random() * cta.length)]}

${hashtags[Math.floor(Math.random() * hashtags.length)]}
`;
};
