const fs = require('fs');
const path = require('path');

async function submitToIndexNow() {
    const siteUrl = 'https://allappsfree.com';
    const key = 'd352e47c0e5b4b1a8f9c1d2e3f4a5b6c';
    const toolsPath = path.join(process.cwd(), 'src/data/tools.json');

    if (!fs.existsSync(toolsPath)) {
        console.error('Tools data not found at:', toolsPath);
        process.exit(1);
    }

    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    const urls = [
        siteUrl,
        `${siteUrl}/tools`,
        `${siteUrl}/tools/games`,
        `${siteUrl}/tools/apps`,
        ...toolsData.tools.map(tool => `${siteUrl}/tools/${tool.slug}`)
    ];

    console.log(`Submitting ${urls.length} URLs to IndexNow...`);

    const data = {
        host: siteUrl.replace('https://', ''),
        key: key,
        keyLocation: `${siteUrl}/${key}.txt`,
        urlList: urls
    };

    try {
        const response = await fetch('https://api.indexnow.org/IndexNow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Successfully submitted to IndexNow!');
        } else {
            const errorText = await response.text();
            console.error('Failed to submit to IndexNow:', response.status, errorText);
        }
    } catch (error) {
        console.error('Error submitting to IndexNow:', error);
    }
}

submitToIndexNow();
