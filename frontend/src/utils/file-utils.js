export class FileUtils {
    static loadPageScript(src, isModule = false) {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src="' + src + '"]')) {
                return resolve("Скрипт уже загружен: " + src);
            }

            const script = document.createElement('script');
            script.src = src;
            script.dataset.dynamic = "true";
            if (isModule) {
                script.type = 'module';
            }
            script.onload = function() {
                resolve("Скрипт загружен: " + src);
            };
            script.onerror = function() {
                reject("Ошибка загрузки скрипта: " + src);
            };
            document.body.appendChild(script);
        });
    }
}