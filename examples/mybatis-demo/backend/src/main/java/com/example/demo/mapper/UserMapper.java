package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 通用 CRUD 由 BaseMapper 提供；selectByKeyword 演示自定义 XML SQL 与 MP 共存。
 */
public interface UserMapper extends BaseMapper<User> {

    List<User> selectByKeyword(@Param("keyword") String keyword);
}
