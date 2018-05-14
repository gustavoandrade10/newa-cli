export const config = {
    NEWARepository: {
        url: 'https://github.com/TalissonJunior/NodeExpressWebApi.git',
        name: 'NodeExpressWebApi',
        databaseConfigPath: 'src/Config/config.json',
        modelsPath: 'src/Models/Database/',
        repositoryPath: {
            interfaces: 'src/Repository/Interfaces/',
            main: 'src/Repository/Repositories/',
            extension: 'Repository.ts'
        },
        businessPath: {
            interfaces: 'src/Business/Interfaces/',
            main: 'src/Business/Rules/',
            factories: 'src/Business/Factories/',
            extension: 'Business.ts'
        },
        baseFoldersStructure: [
            'src/models',
            'src/repository',
            'src/controller',
            'src/business',
            'src/config',
            'gulpfile.js',
            'package.json',
            'tsconfig.json'
        ]
    },
};
  