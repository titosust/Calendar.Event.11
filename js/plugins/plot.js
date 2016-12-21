function Plot(){
    Plugin.apply(this,arguments);
    this._chart=[];
    this._layout=new Layout(this.width,this.height);
    this._layout.padding=20;

    this.view=function(){
        this.clear();
        for(var i in this._chart){
            this.add(this._chart[i]);
        }
        this.draw();
    }

    if(this._hasIO){
        Canvas.call(this,this._settings.dom.output);
        this.addView('Plot',this.view.bind(this));
        

        var inpX=this.addModel('Plot nx',{'input.type':'number','input.value':133}),
            inpY=this.addModel('Plot ny',{'input.type':'number','input.value':24});



        inpX.onchange=function(ev){
            for(var i =0,ln=this._chart.length;i<ln;i++){
                this._chart[i].grid(ev.target.value);
            }
            this.view();
        }.bind(this);

        inpY.onchange=function(ev){
            for(var i =0,ln=this._chart.length;i<ln;i++){
                this._chart[i].grid(null,ev.target.value);
            }
            this.view();
        }.bind(this);

       
        //chart init all

        var chartOrig=new Chart();
        chartOrig.format(function(data){
            var fmtData=[];
            if(data instanceof Array && data.length){
                var date=new Date(data[0].start.dateTime),
                    startDate=new Date(date-86400000),
                    endDate=new Date(data[data.length-1].end.dateTime);
                
                startDate.setMinutes(0);
                startDate.setHours(0);
                
                for(var i=0,ln=data.length;i<ln;i++){
                    var cDate=new Date(data[i].start.dateTime),
                        offsetY=cDate.getHours()+(cDate.getMinutes()/60);
                    fmtData.push(new Point(i,offsetY));           
                }
            }
            return fmtData;
        });
        chartOrig.data(this._data).title('Original').size(this.width/2-60,this.height/2-40);
        this._chart.push(chartOrig);
        this._layout.add(chartOrig);

        var chartGap=new Chart();
        chartGap.format(function(data){
            fmtData=[];
            if(data instanceof Array && data.length){
                var date=new Date(data[0].start.dateTime);
                for(var i=0,ln=data.length;i<ln;i++){
                    var cDate=new Date(data[i].start.dateTime),
                        offsetY=Math.round((cDate-date)/86400000);
                    date=cDate;
                    fmtData.push(new Point(i,offsetY));           
                }
            }
            
            return fmtData;
        });

        chartGap.data(this._data).title('Gap').size(this.width/2-60,this.height/2-40);
        this._chart.push(chartGap);
        this._layout.add(chartGap);

        this._layout.flowLeft();
    }

    this._evt_data_loaded=function(){
        for(var i =0,ln=this._chart.length;i<ln;i++){
            this._chart[i].data(this._data);
        }
    }
}

//make this Chart resizeable.
function Chart(){
    Drawable.call(this);
    this._data=[];
    this._grid={'x':133,'y':24};
    this._title=false;
    this._viewPort=[0,24,0,this._grid.x];

    this._fn_data_format=function(){}

    this.format=function(callBack){
        this._fn_data_format=callBack;
        return this;
    }
    this.data=function(){
        if(arguments.length==1){
            this._data=this._fn_data_format(arguments[0]||[]);
            return this;
        }else{
            return this._data;
        }
    }
    this.grid=function(x,y){
        if(x){
            this._grid.x=parseInt(x);
        }
        if(y){
            this._grid.y=parseInt(y);
        }
        return this;
    }
    this.draw=function(ctx){
        var x=this.x,y=this.y, w=this.width(),h=this.height();
        ctx.save();
        if(this._title){
            ctx.font='bold 16pt Courier';
            ctx.fillStyle='#444';
            ctx.textBaseline="middle";
            ctx.textAlign="center"
            ctx.fillText(this._title, this.x+this.width()/2,this.y+8);
            y+=25;
            h-=25;

        }
        if(this._grid.y){x+=20;w-=20;}
        if(this._grid.x){
            h-=20;
            new Line().position(x,y+h).size(x+w,y+h).draw(ctx);
            
            var tagGap=Math.floor(this._grid.x/30);
            for(var i=0,ln=this._grid.x;i<=ln;i++){
                var ix=this.mapTo(i,0,ln,x,x+w);
                if(i && i%tagGap==0){
                    this.drawLine(ctx,ix,y+h,ix,y);
                    if(i%(tagGap*2)==0) this.label(ctx,ix,y+h,i,3);
                }
            }
        }

        if(this._grid.y){
            new Line().position(x,y).size(x,y+h).draw(ctx);
            for(var i=0,ln=this._grid.y;i<=ln;i++){
                var iy=this.mapTo(i,0,ln,y+h,y);
                if(i && i%2==0)this.label(ctx,x,iy,i,4);
                this.drawLine(ctx,x,iy,x+w,iy); 
            }

        }
        if(this._data && this._data.length){
            for(var i in this._data){
                var point=this._data[i];
                var mapToY=this.mapTo(point.y,0,this._grid.y,y+h,y);
                var mapToX=this.mapTo(point.x,0,this._grid.x,x,x+w);
                ctx.beginPath();
                ctx.fillStyle='#000';
                ctx.arc(mapToX,mapToY,2,0,2*Math.PI);
                ctx.fill();
            }
            ctx.restore();
        }

    }
    this.drawLine=function(ctx,x,y,w,h){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle='#ccc';
        ctx.lineWidth=0.5;
        ctx.moveTo(x,y);
        ctx.lineTo(w,h);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    this.label=function(ctx,x,y,txt,dir){
        ctx.save();
        ctx.beginPath();
        var lx=x,ly=y,lx2=x,ly2=y;
        switch (dir) {
            case 4:
                lx-=4;
                x-=15;
                break;
            case 3:
                ly2+=4;
                y+=15 
            default:
                break;
        }
        ctx.font='10px arial';
        ctx.fillStyle=ctx.strokeStyle='#000';
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        ctx.fillText(txt, x,y);
        ctx.moveTo(lx,ly);
        ctx.lineTo(lx2,ly2);
        ctx.stroke();
        ctx.restore();
    }
    this.title=function(){
        if(arguments.length){
            this._title=arguments[0];
            return this;
        }else{
            return this._title;
        }
    }
    this.mapTo=function(x, a, b, c, d) {
        return  (x-a)/(b-a) * (d-c) + c;
    }
}
Chart.prototype = Object.create(Drawable.prototype);
Chart.prototype.constructor = Chart;