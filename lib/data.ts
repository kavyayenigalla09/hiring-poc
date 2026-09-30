export type Status = "Passed" | "Needs Review" | "Mismatch" | "Accepted" | "Issue";
export type Check = { name:string; status:Status; application:string; label:string; detail:string };
export type Review = { id:string; applicant:string; brand:string; beverage:string; submitted:string; status:Status; checks:Check[] };

export const reviews: Review[] = [
 { id:"COLA-1042", applicant:"Old Tom Distillery LLC", brand:"OLD TOM DISTILLERY", beverage:"Distilled Spirits", submitted:"Today, 9:14 AM", status:"Passed", checks:[
  {name:"Brand Name",status:"Passed",application:"OLD TOM DISTILLERY",label:"OLD TOM DISTILLERY",detail:"Normalized text matches exactly."},
  {name:"Class / Type",status:"Passed",application:"Kentucky Straight Bourbon Whiskey",label:"Kentucky Straight Bourbon Whiskey",detail:"Label and application agree."},
  {name:"Alcohol Content",status:"Passed",application:"45%",label:"45% Alc./Vol. (90 Proof)",detail:"ABV value matches after unit normalization."},
  {name:"Net Contents",status:"Passed",application:"750 mL",label:"750 mL",detail:"Declared net contents match."},
  {name:"Government Warning",status:"Passed",application:"Required warning",label:"GOVERNMENT WARNING: ...",detail:"Required wording detected; heading formatting appears compliant."}
 ]},
 { id:"COLA-1043", applicant:"Blue Ridge Beverage Co.", brand:"STONE'S THROW", beverage:"Distilled Spirits", submitted:"Today, 9:31 AM", status:"Needs Review", checks:[
  {name:"Brand Name",status:"Passed",application:"Stone's Throw",label:"STONE'S THROW",detail:"Case difference only; normalized comparison passes."},
  {name:"Class / Type",status:"Passed",application:"Straight Bourbon Whiskey",label:"Straight Bourbon Whiskey",detail:"Label and application agree."},
  {name:"Alcohol Content",status:"Mismatch",application:"45%",label:"40% Alc./Vol.",detail:"The numeric alcohol content differs."},
  {name:"Net Contents",status:"Passed",application:"750 mL",label:"750 mL",detail:"Declared net contents match."},
  {name:"Government Warning",status:"Passed",application:"Required warning",label:"GOVERNMENT WARNING: ...",detail:"Required wording detected."}
 ]},
 { id:"COLA-1044", applicant:"Harbor Peak Imports", brand:"NORTH STAR GIN", beverage:"Distilled Spirits", submitted:"Today, 10:02 AM", status:"Needs Review", checks:[
  {name:"Brand Name",status:"Passed",application:"NORTH STAR GIN",label:"NORTH STAR GIN",detail:"Normalized text matches exactly."},
  {name:"Class / Type",status:"Passed",application:"Gin",label:"Gin",detail:"Label and application agree."},
  {name:"Alcohol Content",status:"Passed",application:"42%",label:"42% Alc./Vol.",detail:"ABV value matches."},
  {name:"Net Contents",status:"Passed",application:"750 mL",label:"750 mL",detail:"Declared net contents match."},
  {name:"Government Warning",status:"Needs Review",application:"Required warning",label:"Government Warning: ...",detail:"Heading capitalization is not detected as all caps; agent review required."}
 ]}
];
