package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.User;

import java.util.List;

public interface UserService extends IService<User> {

    /** XML 自定义查询：按用户名/邮箱关键字模糊匹配 */
    List<User> search(String keyword);
}
