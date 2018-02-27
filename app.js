const express=require('express');
const bodyParser=require('body-parser');
const multiparty=require('multiparty');
const fileUpload= require('express-fileupload');
const exhbs=require('express-handlebars');
const path=require('path');
const fs=require('fs');
const csv=require('fast-csv');
const csvProtobuf=require('csv-protobuf-stream');
const split=require('binary-split');
const encoder=csvProtobuf();

app=express();


exports.parserform=function(req, res){
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

//model
function GeoObj(n,x,y,z,l,w,h,coor){
  this.N=n;
  this.X=x;
  this.Y=y;
  this.Z=z;
  this.L=l;
  this.W=w;
  this.H=h;  
  this.Coor=coor;
}
//middleware 

//express-handlebars
app.engine('handlebars', exhbs({
defaultLayout:'main'
}));
app.set('view engine','handlebars')

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//variables for csv
console.log('--------------------------------');

//middle-ware works
app.use(function (req, res, next) {
  //req.name = 'nirvik';
  //console.log(Date.now());
  next();
});


//begin of dynamic read csv
function readFile(){
  //wipe the memory 
  var geoObj=[];
  var tarr=[];
  var site="";
  //read the input geometry file
  const path0="./public/csv/output3.csv";
  fs.createReadStream(path0)
    .pipe(csv())
    .on('data', function(data){
        var temp=[];
        //console.log('xxxxx',data);
        tarr.push(data);
    })
    .on('end', function(data){
      console.log('Read finished');
      var tsite=tarr[0];
      site="";
      for(var i=0; i<tsite.length; i++){
          var x= parseFloat(tsite[i].split(";")[0]);
          var y= parseFloat(tsite[i].split(";")[1]);
          if(isNaN(x) || isNaN(y)){
          }else{
            site+=String(x)+","+String(y)+"o";
          }
      }
      for(var i=1;i<tarr.length; i++){
        var arr=tarr[i];
        var n=String(arr[0]);
        //var n=0;
        var x=arr[1];
        var y=arr[2];
        var l=arr[4];
        var w=arr[5];
        var h=arr[6];
        var z=h/2;
        //console.log("final",n,x,y,z,l,w,h)
        var obj= new GeoObj(n,x,y,z,l,w,h,site);
        geoObj.push(obj);
      }    
    });
    return geoObj;
}
//end of dynamic read csv
geoObj=[];
tarr=[];
site="";

//follow links
app.get('/', (req,res)=>{
  /*change now  */
  const geoObj=readFile();
  /*END change now  */
  console.log("ok\n");
  console.log("this : "+geoObj.n);
  res.render('index', {geo:geoObj});
});


//listen server 
port=process.env.PORT||5000;
app.listen(port, ()=>{
  console.log(`server listening on port ${port}`);
})