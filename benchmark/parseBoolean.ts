import { parseBoolean } from '../parser/parseBoolean';
const LOOPS = 100000;
const inputs = {
    small: 'main.Status==6',
    medium:
        ' main.Status  ==  6 and (main.Status  ==  6 or main.Status  ==  6)',
    large:
        '(1==2 and ( (  main.Ready == true   or\t"foo"==  main.Name ) or main.Id   !=main.Name  )   ) and ("bar"!=3  or   4==false)'
};

const run = input => {
    const hrstart = process.hrtime();
    for (let i = 0; i < LOOPS; i++) {
        parseBoolean(input);
    }
    const hrend = process.hrtime(hrstart);
    return hrend;
};

const benchmark = input => {
    console.log(`Start benchmark with ${LOOPS} loops for input\n[${input}]`);
    const time = run(input);
    console.log('Execution time: %ds %dms', time[0], time[1] / 1000000);
};

benchmark(inputs.small);
benchmark(inputs.medium);
benchmark(inputs.large);
