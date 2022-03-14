---
title: OpenCV学习：几何绘制
notshow: false
categories:
  - OpenCV
abbrlink: bbf8a98b
date: 2021-11-10 15:15:40
tags:
---

引言：本文主要介绍OpenCV中的部分几何绘制函数的用法，包括：圆，椭圆，矩形，直线，填充多边形。

<!--more-->

### 示例

```c++
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>

#define w 400
#define h 500

// 头文件
void MyEllipse(cv::Mat img, double angle);
void MyCircle(cv::Mat img, cv::Point center);
void MyPolygon(cv::Mat img);
void MyRectangle(cv::Mat img);
void MyLine(cv::Mat img, cv::Point start, cv::Point end);
// 入口
int main() {
    /*
    cv::Mat atom_image = cv::Mat::zeros(h, w, CV_8UC3);
    MyEllipse(atom_image, 0);
    MyEllipse(atom_image, 90);
    MyEllipse(atom_image, 45);
    MyEllipse(atom_image, -45);
    MyCircle(atom_image, cv::Point(w/2, w/2));
    cv::imshow("ellipse", atom_image);
    cv::waitKey();
    */
	// 注意这里是 h,w 的格式
    cv::Mat rook_image = cv::Mat::zeros(h, w, CV_8UC3);
    MyPolygon(rook_image);
    MyRectangle(rook_image);
    MyLine( rook_image, cv::Point( 0, 15*w/16 ), cv::Point( w, 15*w/16 ) );
    MyLine( rook_image, cv::Point( w/4, 7*w/8 ), cv::Point( w/4, w ) );
    MyLine( rook_image, cv::Point( w/2, 7*w/8 ), cv::Point( w/2, w ) );
    MyLine( rook_image, cv::Point( 3*w/4, 7*w/8 ), cv::Point( 3*w/4, w ) );
    cv::imshow("rook", rook_image);
    // 窗口显示在屏幕上的位置
    cv::moveWindow("rook", 2000, 800 );
    cv::waitKey();
}


// 椭圆
void MyEllipse(cv::Mat img, double angle) {
    int thickness = 2;
    int lineType = 4;
    cv::ellipse(img,
                cv::Point(w/2, w/2),
                cv::Size(w/4, w/16),
                angle,
                0,
                360,
                cv::Scalar( 255, 0, 0 ),
                thickness,
                lineType);
}

// 圆
void MyCircle(cv::Mat img, cv::Point center) {
    cv::circle(img,
               center,
               w/32,
               cv::Scalar(0, 0, 255),
               2,
               16);
}

// 矩形
void MyRectangle(cv::Mat img) {
    cv::rectangle(img,
                  cv::Point(0, 7*w/8),
                  cv::Point(w, w),
                  cv::Scalar(0, 255, 255),
                  -1,
                  8);
}

// 任意多边形填充
void MyPolygon(cv::Mat img) {
  /** Create some points */
  cv::Point rook_points[1][20];
  rook_points[0][0]  = cv::Point(    w/4,   7*w/8 );
  rook_points[0][1]  = cv::Point(  3*w/4,   7*w/8 );
  rook_points[0][2]  = cv::Point(  3*w/4,  13*w/16 );
  rook_points[0][3]  = cv::Point( 11*w/16, 13*w/16 );
  rook_points[0][4]  = cv::Point( 19*w/32,  3*w/8 );
  rook_points[0][5]  = cv::Point(  3*w/4,   3*w/8 );
  rook_points[0][6]  = cv::Point(  3*w/4,     w/8 );
  rook_points[0][7]  = cv::Point( 26*w/40,    w/8 );
  rook_points[0][8]  = cv::Point( 26*w/40,    w/4 );
  rook_points[0][9]  = cv::Point( 22*w/40,    w/4 );
  rook_points[0][10] = cv::Point( 22*w/40,    w/8 );
  rook_points[0][11] = cv::Point( 18*w/40,    w/8 );
  rook_points[0][12] = cv::Point( 18*w/40,    w/4 );
  rook_points[0][13] = cv::Point( 14*w/40,    w/4 );
  rook_points[0][14] = cv::Point( 14*w/40,    w/8 );
  rook_points[0][15] = cv::Point(    w/4,     w/8 );
  rook_points[0][16] = cv::Point(    w/4,   3*w/8 );
  rook_points[0][17] = cv::Point( 13*w/32,  3*w/8 );
  rook_points[0][18] = cv::Point(  5*w/16, 13*w/16 );
  rook_points[0][19] = cv::Point(    w/4,  13*w/16 );
  
  // ppt为二级指针（rook_points[0]是一个指针，所以ppt是一个指针数组，数组名是指向数组的指针）
  const cv::Point* ppt[1] = {rook_points[0]};
  int npt[] = {20};
  cv::fillPoly(img, ppt, npt, 1, cv::Scalar( 255, 255, 255 ), 8);

}

// 直线
void MyLine(cv::Mat img, cv::Point start, cv::Point end) {
    int thickness = 2;
    int lineType = cv::LINE_8;
    cv::line(img, start, end, cv::Scalar(0, 0, 0), thickness, lineType);
}
```

### 说明

1.椭圆

```c++
cv::ellipse(img,
            cv::Point(w/2, w/2),
            cv::Size(w/4, w/16),
            angle,
            0,
            360,
            cv::Scalar( 255, 0, 0 ),
            thickness,
            lineType);
```

img：cv::Mat图像

cv::Point(w/2, w/2)：椭圆心

cv::Size(w/4, w/16)：焦距

angle：旋转角度（不是弧度），注意是图像坐标系，右是正x，下是正y

angle_begin：圆弧的起始角度（不是弧度）

angle_end：圆弧的结束角度（不是弧度）

cv::Scalar( 255, 0, 0 )：颜色，BGR顺序

thickness：线宽， -1代表填充

lineType：线型，16是抗锯齿的线型，看起来边缘更平滑。可选-1，4， 8， 16，关于四邻域线型和八邻域线型，参考[这里](https://blog.csdn.net/young__fan/article/details/82696276)。

2.圆

```c++
cv::circle(img,
            center,
            w/32,
            cv::Scalar(0, 0, 255),
            2,
            16);
```

img：cv::Mat图像

center：cv::Point，圆心

w/32：int,，半径

cv::Scalar(0, 0, 255)：颜色，BGR顺序

thickness：同上

lineType：同上

3.矩形

```c++
cv::rectangle(img,
                cv::Point(0, 7*w/8),
                cv::Point(w, w),
                cv::Scalar(0, 255, 255),
                -1,
                8);
```

img：cv::Mat图像

pt1：矩形左上角坐标，cv::Point

pt2：矩形右下角坐标，cv::Point

cv::Scalar(0, 255, 255)：颜色

thickness：同上

lineType：同上

4.直线（多边形）

```c++
cv::line(img, start, end, cv::Scalar(0, 0, 0), thickness, lineType);
```

img：cv::Mat图像

start：cv::Point，起始点

end：cv::Point，终止点

cv::Scalar(0, 0, 0)：颜色

thickness：同上

lineType：同上

5.填充多边形

```c++
cv::fillPoly(img, ppt, npt, 1, cv::Scalar( 255, 255, 255 ), 8);
```

img：cv::Mat图像

ppt：Array of polygons where each polygon is represented as an array of points.

npt：Array of 每个polygon的点数

ncontours：多边形数量

cv::Scalar(0, 0, 0)：颜色

lineType：同上