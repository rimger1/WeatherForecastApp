-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Okt 18. 16:58
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `weatherapp_2026`
--
CREATE DATABASE IF NOT EXISTS `weatherapp_2026` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `weatherapp_2026`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `passwd` varchar(40) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'user',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `registered_at` date NOT NULL DEFAULT current_timestamp(),
  `updated_at` date DEFAULT NULL,
  `last_login` date DEFAULT NULL,
  `login_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `passwd`, `role`, `status`, `registered_at`, `updated_at`, `last_login`, `login_count`) VALUES
(5, 'b', 'b', 'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418f98', 'user', 0, '2026-10-06', NULL, NULL, 0),
(6, 'c', 'c', '84a516841ba77a5b4648de2cd0dfcb30ea46dbb4', 'user', 1, '2026-10-08', NULL, NULL, 0),
(7, 'admin', 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'admin', 1, '2026-10-09', NULL, NULL, 0),
(8, 'asd', 'asd', 'f10e2821bbbea527ea02200352313bc059445190', 'user', 1, '2026-10-15', NULL, NULL, 0),
(9, 'asd', 'sad', 'f10e2821bbbea527ea02200352313bc059445190', 'user', 1, '2026-10-15', NULL, NULL, 0),
(10, 'asd', 'dasd', 'f10e2821bbbea527ea02200352313bc059445190', 'user', 1, '2026-10-15', NULL, NULL, 0),
(11, 'asd', 'dasds', 'f10e2821bbbea527ea02200352313bc059445190', 'user', 1, '2026-10-15', NULL, NULL, 0),
(12, 'fafa', 'fafa', '1fe171f65917db0072abc6880196989dd2a20025', 'user', 1, '2026-10-16', NULL, NULL, 0),
(13, 'fafa', 'fafaf', '1fe171f65917db0072abc6880196989dd2a20025', 'user', 1, '2026-10-16', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weather`
--

CREATE TABLE `weather` (
  `ID` int(100) NOT NULL,
  `date` date NOT NULL,
  `location` varchar(200) NOT NULL,
  `temp_min` decimal(10,0) NOT NULL,
  `temp_max` decimal(10,0) NOT NULL,
  `weather_type` varchar(200) NOT NULL,
  `precipitation` varchar(200) NOT NULL,
  `precipitation_probability` int(10) NOT NULL,
  `wind_speed` int(10) NOT NULL,
  `wind_direction` varchar(200) NOT NULL,
  `humidity` int(10) NOT NULL,
  `pressure` int(10) NOT NULL,
  `uv_index` int(10) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `weather`
--

INSERT INTO `weather` (`ID`, `date`, `location`, `temp_min`, `temp_max`, `weather_type`, `precipitation`, `precipitation_probability`, `wind_speed`, `wind_direction`, `humidity`, `pressure`, `uv_index`, `created_at`, `updated_at`) VALUES
(2, '2026-10-10', 'baja', 10, 10, 'eso', 'eso', 10, 10, 'eszak', 10, 10, 10, '2026-10-09', NULL),
(3, '2026-10-17', 'Baja', 9, 17, 'sunny', '0.0', 5, 12, 'NW', 58, 1019, 4, '2026-10-16', '2026-10-16'),
(4, '2026-10-17', 'Budapest', 9, 16, 'cloudy', '0.4', 25, 16, 'W', 66, 1015, 3, '2026-10-16', '2026-10-16'),
(5, '2026-10-18', 'Szeged', 7, 15, 'rainy', '6.3', 80, 22, 'SW', 84, 1009, 1, '2026-10-16', '2026-10-16'),
(6, '2026-10-30', 'Baja', 12, 123, 'rainy', '0.3', 1, 23, 'S', 1, 0, 0, '2026-10-17', NULL),
(7, '2026-10-30', 'Baja', 12, 123, 'sunny', '0.3', 1, 23, 'S', 1, 1, 4, '2026-10-17', NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `weather`
--
ALTER TABLE `weather`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `weather`
--
ALTER TABLE `weather`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
