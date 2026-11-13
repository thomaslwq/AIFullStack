package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** MP 分页 + 条件构造器 */
    @GetMapping("/page")
    public Map<String, Object> page(@RequestParam(defaultValue = "1") Integer pageNum,
                                    @RequestParam(defaultValue = "5") Integer pageSize,
                                    @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
                .like(keyword != null && !keyword.isBlank(), User::getUsername, keyword)
                .orderByDesc(User::getId);

        Page<User> result = userService.page(new Page<>(pageNum, pageSize), wrapper);

        Map<String, Object> data = new HashMap<>();
        data.put("records", result.getRecords());
        data.put("total", result.getTotal());
        data.put("pageNum", result.getCurrent());
        data.put("pageSize", result.getSize());
        data.put("pages", result.getPages());
        return data;
    }

    @GetMapping("/{id}")
    public User get(@PathVariable Integer id) {
        return userService.getById(id);
    }

    @PostMapping
    public Boolean add(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping
    public Boolean update(@RequestBody User user) {
        return userService.updateById(user);
    }

    @DeleteMapping("/{id}")
    public Boolean delete(@PathVariable Integer id) {
        return userService.removeById(id);
    }

    /** XML 自定义模糊查询 */
    @GetMapping("/search")
    public List<User> search(@RequestParam(required = false) String keyword) {
        return userService.search(keyword);
    }
}
