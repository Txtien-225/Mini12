<?php
declare(strict_types=1);
require __DIR__.'/config.php';

$action = $_GET['action'] ?? '';
$data = body();

try {
    if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $name = trim((string)($data['fullName'] ?? ''));
        $email = strtolower(trim((string)($data['email'] ?? '')));
        $password = (string)($data['password'] ?? '');
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
            respond(['error' => 'Họ tên, email hợp lệ và mật khẩu từ 6 ký tự là bắt buộc.'], 422);
        }
        $stmt = db()->prepare('INSERT INTO users(full_name,email,password_hash) VALUES(?,?,?)');
        try { $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]); }
        catch (PDOException $e) { if ($e->errorInfo[1] === 1062) respond(['error' => 'Email này đã được đăng ký.'], 409); throw $e; }
        respond(['message' => 'Đăng ký thành công.'], 201);
    }

    if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $email = strtolower(trim((string)($data['email'] ?? '')));
        $password = (string)($data['password'] ?? '');
        $stmt = db()->prepare('SELECT id,full_name,email,password_hash FROM users WHERE email=?');
        $stmt->execute([$email]); $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) respond(['error' => 'Email hoặc mật khẩu không đúng.'], 401);
        $token = bin2hex(random_bytes(32));
        db()->prepare('INSERT INTO api_sessions(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 30 DAY))')->execute([$user['id'], hash('sha256', $token)]);
        unset($user['password_hash']);
        respond(['token' => $token, 'user' => $user]);
    }

    if ($action === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') respond(['user' => authUser()]);

    if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        db()->prepare('DELETE FROM api_sessions WHERE token_hash=?')->execute([hash('sha256', bearer())]);
        respond(['message' => 'Đã đăng xuất.']);
    }

    if ($action === 'surveys') {
        $user = authUser();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $stmt = db()->prepare('SELECT id,created_at AS createdAt,status,building,floor,room,category,rating,notes,photo,latitude,longitude FROM surveys WHERE user_id=? ORDER BY created_at DESC');
            $stmt->execute([$user['id']]); respond(['surveys' => $stmt->fetchAll()]);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            foreach ([$data] as $survey) {
                foreach (['id','createdAt','building','floor','room','category','rating'] as $key) if (!array_key_exists($key, $survey)) respond(['error' => 'Dữ liệu phiếu khảo sát thiếu trường '. $key], 422);
                db()->prepare('INSERT INTO surveys(id,user_id,building,floor,room,category,rating,notes,photo,latitude,longitude,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status),notes=VALUES(notes),photo=VALUES(photo),latitude=VALUES(latitude),longitude=VALUES(longitude)')->execute([
                    $survey['id'], $user['id'], $survey['building'], $survey['floor'], $survey['room'], $survey['category'], (int)$survey['rating'], $survey['notes'] ?? null, $survey['photo'] ?? null, $survey['latitude'] ?? null, $survey['longitude'] ?? null, 'SYNCED', date('Y-m-d H:i:s', strtotime($survey['createdAt']))
                ]);
            }
            respond(['message' => 'Đã lưu phiếu khảo sát.']);
        }
    }
    respond(['error' => 'Không tìm thấy API.'], 404);
} catch (Throwable $e) {
    respond(['error' => 'Lỗi máy chủ: '.$e->getMessage()], 500);
}
