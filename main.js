"use strict";

var size=120;
var objs=[];
var dt=0.15;
var steps=35;

var Obj=function(x,y,r,f)
{
	return {
		x:x,
		y:y,
		r:r,
		m:r*r/15,
		f:f,
		xv:0,
		yv:0,
		xa:0,
		ya:0
	};
};

var initMain=function()
{
	var n;
	n=size;
	while(n--)
	{
		objs[n]=Obj(
			100*rand()-50,
			80*rand()-35,
			1.2*rand()+1.2,
			hsla(200+60*rand(),1,rand()/2+0.5,1)
		);
	}
	dt/=steps;
	point();
	var t=time();
	var x,y;
	n=100000;
	while(n--)
	{
		x=rand();
		y=rand();
		hypo(x,y);
	}
	console.log(time()-t);
};

var callClick=function()
{
	var n,no,dx,dy;
	n=size;
	while(n--)
	{
		no=objs[n];
		dx=userX-no.x;
		dy=userY+52;
		dy/=4;	
		no.yv+=2000/(50+pow2(dy)+pow2(dx)/dy*4);
	}
};

var physics=function()
{
	var n,no,m,mo,xa,ya,d,dx,dy,dv,r;
	n=size;
	while(n--)
	{
		no=objs[n];
		xa=no.xa;
		ya=no.ya;
		ya-=no.m*2;
		d=absv(no.x)+no.r-50;
		if(d>0)
		{
			xa-=sign(no.x)*d*160*no.m;
		}
		d=absv(no.y-5)+no.r-45;
		if(d>0)
		{
			ya-=sign(no.y-5)*d*160*no.m;
		}
		m=n;
		while(m--)
		{
			mo=objs[m];
			dx=no.x-mo.x;
			dy=no.y-mo.y;
			d=hypo(dx,dy);
			r=no.r+mo.r;
			if(d<=r)
			{
				dx/=d;
				dy/=d;
				dv=[
					no.xv-mo.xv,
					no.yv-mo.yv
				];
				d-=r;
				d*=160;
				d+=0.25*dpro(dv,[dx,dy]);
				xa-=d*dx;
				ya-=d*dy;
				mo.xa+=d*dx;
				mo.ya+=d*dy;
			}
		}
		no.xa=xa;
		no.ya=ya;
	}
	n=size;
	while(n--)
	{
		no=objs[n];
		d=1+hypo(no.xv,no.yv)/25;
		no.xv+=no.xa/no.m*dt;
		no.yv+=no.ya/no.m*dt;
		no.x+=no.xv/d*dt;
		no.y+=no.yv/d*dt;
		no.xa=0;
		no.ya=0;
	}
};

var draw=function()
{
	var n,no,x,y;
	ctx.clearRect(-100,-50,200,100);
	n=size;
	while(n--)
	{
		no=objs[n];
		x=no.x;
		y=no.y;
		mark(x,y,no.r*0.9,no.f);
	}
	n=200;
	while(n--)
	{
		x=n-100-userX;
		y=userY+52;
		y/=5;
		x=100/(50+pow2(y)+pow2(x)*4/y);
		if(x>1)
		{
			x=1;
		}
		if(x>0.1)
		{
			ctx.fillStyle=rgba(1,0,0,x);
			ctx.fillRect(n-100,-41,1.1,-1);
		}
	}
};

var chronometric=function()
{
	var n;
	n=steps;
	while(n--)
	{
		physics();
	}
	draw();
};