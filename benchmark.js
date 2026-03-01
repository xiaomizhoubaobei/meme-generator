#!/usr/bin/env node

/**
 * 表情包生成器性能基准测试脚本
 */

const http = require('http');

const BASE_URL = 'http://localhost:8080';

async function benchmark() {
    console.log('🏃 正在运行性能基准测试...\n');

    const tests = [
        {
            name: '健康检查',
            url: '/health',
            iterations: 100
        },
        {
            name: '获取表情包键值',
            url: '/memes/keys',
            iterations: 50
        },
        {
            name: '获取 Petpet 信息',
            url: '/memes/petpet/info',
            iterations: 50
        }
    ];

    for (const test of tests) {
        console.log(`📊 测试中: ${test.name}`);
        const times = [];

        for (let i = 0; i < test.iterations; i++) {
            const start = Date.now();
            await makeRequest(test.url);
            times.push(Date.now() - start);
        }

        const avg = times.reduce((a, b) => a + b) / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);
        const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

        console.log(`  平均值: ${avg.toFixed(2)}ms`);
        console.log(`  最小值: ${min}ms`);
        console.log(`  最大值: ${max}ms`);
        console.log(`  P95: ${p95}ms\n`);
    }

    console.log('✅ 基准测试完成!');
}

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const req = http.get(`${BASE_URL}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
    });
}

// 如果直接执行，则运行基准测试
if (require.main === module) {
    benchmark().catch(console.error);
}

module.exports = { benchmark };