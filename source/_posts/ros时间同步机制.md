---
title: 多传感器时间同步机制
notshow: false
date: 2021-11-25 15:07:02
tags:
- 时间同步
categories:
- ADAS和自动驾驶
---

引言：多传感器时间同步是高级辅助驾驶系统和自动驾驶中必不可少的关键步骤，本文主要介绍一种多传感器时间同步的方法，并进行了C++实现。

<!--more-->

### 介绍

多传感器时间同步就是把不同传感器发出的message序列在时间上进行匹配，比如有多个激光雷达，多个摄像头，多个radar，以及组合惯导等传感器，在系统启动后，这些传感器都在以一定的频率往外部发送消息，那么某一时刻而言，究竟取这些传感器的哪一个消息，才是同一时刻的呢？这些传感器的频率可能不同，但是每一帧消息应该都有一个时间戳，代表这个消息是哪个时间产生的，比如一共有20个传感器，同步好的代表当前的所有消息应该也是20帧，他们之间的时间戳应该一致，但是由于频率不一致，所以很难保证具有完全相同的时间戳，所以退而求其次，可以在一定的时间范围内认为这20个消息是同步的，他们应该满足一个条件，就是不应该存在另一个选择，使得这20个消息的时间跨度（最早时间和最晚时间之差）小于当前的时间跨度，这样才认为这个同步是正确的，ros实现了这种时间同步的方法，下面将对其使用方法和原理进行详细说明，由于该算法比较绕，考虑的情况也比较多，个人也只是一知半解。

### 使用方法

下面是一个4个激光雷达产生的点云消息和1个组合惯导产生的pose消息，其中雷达发出的点云消息为10hz，惯导产生的pose消息为100hz。

```c++
#include <ros/ros.h>
#include <sensor_msgs/PointCloud2.h>
#include <geometry_msgs/PoseStamped.h>
#include <message_filters/subscriber.h>
#include <message_filters/synchronizer.h>
#include <message_filters/sync_policies/approximate_time.h>


void callback(const sensor_msgs::PointCloud2ConstPtr &msg0,
              const sensor_msgs::PointCloud2ConstPtr &msg1,
              const sensor_msgs::PointCloud2ConstPtr &msg2,
              const sensor_msgs::PointCloud2ConstPtr &msg3,
              const geometry_msgs::PoseStampedConstPtr &msg4) {
    std::cout << std::fixed << "/back_lidar: " << msg3->header.stamp.toSec() << std::endl
                            << "/left_lidar: " << msg1->header.stamp.toSec() << std::endl
                            << "/middle_lidar: " << msg0->header.stamp.toSec() << std::endl
                            << "/pose_stamp: " << msg4->header.stamp.toSec() << std::endl
                            << "/right_lidar: " << msg2->header.stamp.toSec() << std::endl;
                            
    std::cout << "-------------------------------------------------" << std::endl;
}

int main(int argc, char **argv){

    ros::init(argc, argv, "ros_sync_test");
    ros::NodeHandlePtr node_ptr;
    node_ptr.reset(new ros::NodeHandle);

    std::string topic0, topic1, topic2, topic3, topic4;
    topic0 = "/mems_front/rslidar_points";
    topic1 = "/mems_left/rslidar_points";
    topic2 = "/mems_right/rslidar_points";
    topic3 = "/mems_back/rslidar_points";
    topic4 = "/loc/car_pose_1";

    message_filters::Subscriber<sensor_msgs::PointCloud2> sub_topic0(*node_ptr, topic0, 1000);
    message_filters::Subscriber<sensor_msgs::PointCloud2> sub_topic1(*node_ptr, topic1, 1000);
    message_filters::Subscriber<sensor_msgs::PointCloud2> sub_topic2(*node_ptr, topic2, 1000);
    message_filters::Subscriber<sensor_msgs::PointCloud2> sub_topic3(*node_ptr, topic3, 1000);
    message_filters::Subscriber<geometry_msgs::PoseStamped> sub_topic4(*node_ptr, topic4, 1000);

    typedef message_filters::sync_policies::ApproximateTime<sensor_msgs::PointCloud2,
                                                            sensor_msgs::PointCloud2,
                                                            sensor_msgs::PointCloud2,
                                                            sensor_msgs::PointCloud2,
                                                            geometry_msgs::PoseStamped> syncPolicy;

    message_filters::Synchronizer<syncPolicy> sync(syncPolicy(100),
                                                        sub_topic0,
                                                        sub_topic1,
                                                        sub_topic2,
                                                        sub_topic3,
                                                        sub_topic4);

    sync.registerCallback(boost::bind(&callback, _1, _2, _3, _4, _5));

    ros::spin();
    return 0;
}
```

syncPolicy(100)中的100是每个消息队列的最大长度，如果某个消息队列缓存长度大于100（即连续100个消息还没有同步上），就会产生问题，所以这个尽可能设置的大一些。

### 算法实现

ros规定这种时间同步机制最多支持9个不同的消息，下面在不改变算法原理的基础上进行了异步实现，且不限制同步的消息个数。

[github代码链接](https://github.com/zsh4614/time_sync)